package com.soccup;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;


public class RenderRandomTeam extends Activity {
    private String tournament;
    private String idTournament;
    private Api api = new Api();
    private String idLeague;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        Button btnBegin = (Button) findViewById(R.id.btnCreateTeam);
        Bundle extras = getIntent().getExtras();

        // EVENT BUTTON BEGIN
        btnBegin.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(RenderRandomTeam.this, CurrentTournament.class);

                // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
                intent.putExtra("TOURNAMENT", tournament);
                intent.putExtra("LEAGUE", idLeague);

                startActivity(intent);
                overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
            }
        });

        if(extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                JSONObject json = new JSONObject(tournament);
                idTournament = json.getString("_id");

                // GET CURRENT TOURNAMENT
                getCurrentTournament(idTournament);
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private void getCurrentTournament(String idTournament) {
        final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);

        api.getTournamentById(idTournament, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Get Tournament", error);}

            public void onSuccess(Response response) throws IOException, JSONException {
                String data = response.body().string();
                final JSONObject json = new JSONObject(data);

                // TEAMS
                JSONArray teams = json.getJSONArray("teams");
                int nbTeams = teams.length();

                // LOOP ON TEAMS
                for(int i = 0; i < nbTeams; i++) {
                    final int finalI = i;
                    final LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);
                    final String idTeam = teams.getString(i);

                    boxTeam.removeAllViews();

                    // GET THE TEAM
                    api.getTeam(idTeam, new Api.ApiCallback() {
                        public void onFailure(String error) { Log.d("Get Teams", error); }

                        public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                            String data = response.body().string();
                            JSONObject json = new JSONObject(data);
                            String color = "#000000";//json.getString("color");

                            com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_team_input, null);
                            input.setHint(json.getString("teamName"));
                            input.setFloatingLabelText(json.getString("teamName"));
                            input.setBackgroundColor(Color.parseColor(color));

                            input.setKeyListener(null);
                            boxTeam.setId(finalI);
                            boxTeam.addView(input);

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
                                        JSONObject player = new JSONObject(json.getString(j));
                                        input.setHint(player.getString("playerName"));

                                        input.setKeyListener(null);
                                        boxTeam.setId(finalI);
                                        boxTeam.addView(input);
                                    }

                                    // RUN UI
                                    runOnUiThread(new Runnable() {
                                        public void run() {
                                            boxContentTeam.addView(boxTeam);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_render_random_team, menu);
        return true;
    }

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
