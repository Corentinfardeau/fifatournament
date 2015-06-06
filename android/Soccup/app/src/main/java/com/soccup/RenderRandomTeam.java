package com.soccup;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.LinearLayout;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;


public class RenderRandomTeam extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        String tournament;
        Bundle extras = getIntent().getExtras();

        if (extras != null) {

            tournament = extras.getString("TOURNAMENT");

            try {
                JSONObject json = new JSONObject(tournament);
                final Api api = new Api();

                // LAYOUTS
                final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.test);

                // GET CURRENT TOURNAMENT
                api.getTournamentById(json.getString("_id"), new Api.ApiCallback() {

                    public void onFailure(String error) { Log.d("Get Tournament", error);}

                    public void onSuccess(Response response) throws IOException, JSONException {
                        String data = response.body().string();
                        final JSONObject json = new JSONObject(data);

                        // TEAMS
                        JSONArray teams = json.getJSONArray("teams");
                        int nbTeams = teams.length();

                        // LOOP ON TEAMS
                        for(int i = 0; i < nbTeams; i++) {
                            final LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);
                            boxTeam.removeAllViews();
                            String idTeam = teams.getString(i);

                            // GET PLAYERS OF THE TEAM
                            api.getTeamPlayers(idTeam, new Api.ApiCallback() {

                                public void onFailure(String error) { Log.d("Get Teams Players", error); }

                                public void onSuccess(Response response) throws IOException, JSONException {
                                    String data = response.body().string();

                                    JSONArray json = new JSONArray(data);
                                    int nbPlayers = json.length();

                                    // LOOP ON PLAYERS
                                    for (int j = 0; j < nbPlayers; j++) {
                                        com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_player_input, null);

                                        if(j == 0){
                                            //input = ;
                                            input.setHint("Equipe");
                                        }
                                        else{
                                            input.setHint("Joueur " + j);
                                        }

                                        input.setFloatingLabelText("Joueur " + j);
                                        input.setKeyListener(null);

                                        boxTeam.addView(input);
                                    }
                                    final com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_player_input, null);
                                    runOnUiThread(new Runnable() {
                                        public void run() {
                                            boxContentTeam.addView(boxTeam);
                                        }
                                    });

                                }
                            });
                        }
                    }
                });
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_render_random_team, menu);
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
