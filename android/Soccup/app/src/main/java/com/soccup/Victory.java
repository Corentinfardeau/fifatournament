package com.soccup;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.soccup.models.Api;
import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public class Victory extends AppCompatActivity {
    private String tournament;
    private String idTournament;
    private String idLeague;
    private Api api = new Api();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_victory);

        final TextView victory = (TextView)findViewById(R.id.teamVictory);
        Button stats = (Button) findViewById(R.id.stats);
        Button restarts = (Button) findViewById(R.id.restart);

        // RESTART TOURNAMENT
        restarts.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                Intent intent = new Intent(Victory.this, ConfigurationActivity.class);
                startActivity(intent);
                overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
            }
        });

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                JSONObject dataTournament = new JSONObject(tournament);
                idTournament = dataTournament.getString("_id");

                // BUILD OPTIONS
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("idLeague", idLeague);
                options.put("order_by", "classic");

                // GET THE LEAGUE
                getRankingLeague(options, new Callback() {
                    public void onSuccess(Map<String, Object> winner) throws JSONException {
                        final JSONObject team = (JSONObject) winner.get("winner");

                        // RUN UI
                        runOnUiThread(new Runnable() {
                            public void run() {
                                try { victory.setText(team.getString("teamName")); } catch (JSONException e) { e.printStackTrace(); }
                            }
                        });
                    }
                });
            }
            catch (JSONException e) {   e.printStackTrace();  }

            stats.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    Intent intent = new Intent(Victory.this, Stats.class);

                    // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
                    intent.putExtra("TOURNAMENT", tournament);
                    intent.putExtra("LEAGUE", idLeague);

                    // START
                    startActivity(intent);
                    Victory.this.overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
                }
            });
        }
    }

    private void getRankingLeague(Map<String, Object> options, final Callback cb) {
        api.getRankingLeague(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET RANKING LEAGUE", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                Log.d("RANKING", data);
                JSONArray teamsRanking = new JSONArray(data);
                JSONObject winner = new JSONObject(teamsRanking.getString(0));

                Map<String, Object> winnerMap = new HashMap<String, Object>();
                winnerMap.put("winner", winner);
                cb.onSuccess(winnerMap);
            }
        });
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_victory, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> value) throws JSONException;
    }
}
