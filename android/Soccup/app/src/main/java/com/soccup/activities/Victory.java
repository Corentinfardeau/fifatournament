package com.soccup.activities;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.soccup.R;
import com.soccup.models.League;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class Victory extends AppCompatActivity {
    private String tournament;
    private String idLeague;

    // MODELS
    private League currentLeague = new League();

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_victory);

        // COMPONENTS
        final TextView victory = (TextView)findViewById(R.id.teamVictory);
        Button stats = (Button) findViewById(R.id.stats);
        Button playAgain = (Button) findViewById(R.id.restart);

        // EXTRAS
        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            // BUILD OPTIONS TO GET THE LEAGUE
            Map<String, Object> options = new HashMap<String, Object>();
            options.put("idLeague", idLeague);
            options.put("order_by", "classic");

            // GET THE LEAGUE
            currentLeague.getRankingLeague(options, new League.Callback() {
                public void onSuccess(Map<String, Object> options) throws JSONException {
                    JSONArray teamsRanking = (JSONArray) options.get("teams");
                    final JSONObject team = new JSONObject(teamsRanking.getString(0));

                    // RUN UI ON MAIN THREAD
                    runOnUiThread(new Runnable() {
                        public void run() {
                            try {
                                victory.setText(team.getString("teamName"));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    });
                }
            });

            // GO TO STATS
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

            // RESTART THE TOURNAMENT
            playAgain.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {

                    // DELETE THE TOURNAMENT

                    Intent intent = new Intent(Victory.this, ConfigurationActivity.class);

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

    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_victory, menu);
        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

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
