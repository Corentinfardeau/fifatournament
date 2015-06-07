package com.soccup;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public class CurrentTournament extends Activity {
    private String tournament;
    private String idTournament;
    private String idLeague;
    private String idCurrentMatch;
    private JSONArray firstLeg;
    private JSONArray returnLeg;
    private Api api = new Api();
    private JSONObject currentMatch;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.current_tournament);

        Bundle extras = getIntent().getExtras();
        Button btnMatchNext = (Button) findViewById(R.id.btnMatchNext);

        // EVENT ON BTNMATCHNEXT
        btnMatchNext.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Map<String, Object> options = new HashMap<String, Object>();
                    options.put("idMatch", idCurrentMatch);

                try {
                    options.put("played", true);
                    options.put("goalAwayTeam", currentMatch.getInt("goalAwayTeam"));
                    options.put("goalHomeTeam", currentMatch.getInt("goalHomeTeam"));
                }
                catch (JSONException e) {
                    e.printStackTrace();
                }

                // UPDATE MATCH
                updateMatch(options);

                // NB MATCHS BY TURN
                int nbMatchs = firstLeg.length();
                Boolean played = true;

                for(int i = 0; i < nbMatchs; i++){
                    try {
                        JSONObject match = new JSONObject(firstLeg.getString(i));

                        // NEW MATCH
                        if(match.getBoolean("played") == false){
                            currentMatch = match;
                            played = false;
                            showMatch(currentMatch);
                            break;
                        }
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                // ALL OF THE FIRST MATCH ARE PLAYED
                if(played == true){
                    for(int i = 0; i < nbMatchs; i++){
                        try {
                            JSONObject match = new JSONObject(returnLeg.getString(i));

                            // NEW MATCH
                            if(match.getBoolean("played") == false){
                                currentMatch = match;
                                played = false;
                                showMatch(currentMatch);
                                break;
                            }
                        }
                        catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }

                // ALL THE MATCHS ARE PLAYED
                if(played == true){
                    // PROPOSER DE TERMINER LE TOURNOI
                }
            }
        });

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                JSONObject dataTournament = new JSONObject(tournament);
                idTournament = dataTournament.getString("_id");

                // GET THE LEAGUE
                getLeague(idLeague);

            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private void updateMatch(Map<String, Object> options) {
        api.updateMatch(options, new Api.ApiCallback() {
            public void onFailure(String error) { Log.d("UPDATE MATCH", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                Log.d("data", data);
            }
        });
    }

    public void getLeague(String idLeague){
        api.getLeague(idLeague, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET A LEAGUE", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject dataLeague = new JSONObject(data);

                // RETURN AND FIRST LEG
                firstLeg = dataLeague.getJSONArray("firstLeg");
                returnLeg = dataLeague.getJSONArray("returnLeg");

                // THE FIRST MATCH
                JSONObject match = new JSONObject(firstLeg.getString(0));
                idCurrentMatch = match.getString("_id");

                // GET THE MATCH
                getMatch(idCurrentMatch);
            }
        });
    }

    private void getMatch(String idCurrentMatch) {
        api.getMatch(idCurrentMatch, new Api.ApiCallback() {
            public void onFailure(String error) { Log.d("GET CURRENT MATCH", error); }

            @Override
            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String dataMatch = response.body().string();
                currentMatch = new JSONObject(dataMatch);
                showMatch(currentMatch);
            }
        });
    }

    private void showMatch(JSONObject currentMatch) {

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_current_match, menu);
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
}
