package com.soccup.activities;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.soccup.R;
import com.soccup.models.Team;
import com.soccup.models.Tournament;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class RenderRandomTeam extends AppCompatActivity {
    private String tournament;
    private String idTournament;
    private String idLeague;
    private int nbTeams;
    private JSONArray teams;

    // MODELS
    private Team objectTeam = new Team();
    private Tournament objectTournament = new Tournament();

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        Button btnBegin = (Button) findViewById(R.id.btnCreateTeam);
        Bundle extras = getIntent().getExtras();

        // EVENT BUTTON BEGIN
        btnBegin.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                for(int i = 0; i < nbTeams; i++){

                    final int finalI = i;
                    final com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) findViewById(i);

                    try {
                        String idTeam = teams.getString(i);

                        // GET THE TEAM
                        objectTeam.getTeam(idTeam, new Team.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                JSONObject team = (JSONObject) options.get("team");

                                String teamName;
                                if(input.getText().toString().isEmpty()) teamName = team.getString("teamName");
                                else teamName = input.getText().toString();

                                // OPTIONS OF TEAM UPDATE ACTION
                                Map<String,Object> optionsTeam = new HashMap<String, Object>();
                                optionsTeam.put("played", team.getInt("played"));
                                optionsTeam.put("idTeam", team.getString("_id"));
                                optionsTeam.put("teamName", teamName);
                                optionsTeam.put("won", team.getInt("won"));
                                optionsTeam.put("lost", team.getInt("lost"));
                                optionsTeam.put("drawn", team.getInt("drawn"));
                                optionsTeam.put("gf", team.getInt("gf"));
                                optionsTeam.put("ga", team.getInt("ga"));
                                optionsTeam.put("gd", team.getInt("gd"));
                                optionsTeam.put("pts", team.getInt("pts"));

                                // UPDATE NAME OF THE TEAM
                                objectTeam.updateTeam(optionsTeam, new Team.Callback() {
                                    public void onSuccess(Map<String, Object> options) throws JSONException {

                                        // IF ITS THE LAST TEAM START THE NEW ACTIVITY
                                        if(finalI == nbTeams - 1){
                                            Intent intent = new Intent(RenderRandomTeam.this, CurrentTournamentActivity.class);

                                            // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
                                            intent.putExtra("TOURNAMENT", tournament);
                                            intent.putExtra("LEAGUE", idLeague);

                                            startActivity(intent);
                                            overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
                                        }
                                    }
                                });
                            }
                        });

                    } catch (JSONException e) { e.printStackTrace(); }
                }
            }
        });

        if(extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                JSONObject json = new JSONObject(tournament);
                idTournament = json.getString("_id");

                // GET CURRENT TOURNAMENT
                objectTournament.getTournament(idTournament, new Tournament.Callback() {
                    public void onSuccess(Map<String, Object> options) throws JSONException {
                        JSONObject currentTournament = (JSONObject) options.get("tournament");

                        // TEAMS
                        teams = currentTournament.getJSONArray("teams");
                        nbTeams = teams.length();
                        int iterator = 0;

                        // RECURSIVE FUNCTION TO GET THE TEAM AND DRAW IT
                        drawTeam(iterator, nbTeams, teams);
                    }
                });

            } catch (JSONException e) {  e.printStackTrace(); }
        }
    }

    private void drawTeam(final int iterator, final int nbTeams, final JSONArray teams) throws JSONException {
        final String idTeam = teams.getString(iterator);

        // COMPONENTS
        final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);
        final LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);

        LinearLayout.LayoutParams boxTeamParams = new  LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        boxTeamParams.setMargins(0,30,0,30);
        boxTeam.setLayoutParams(boxTeamParams);

        boxTeam.removeAllViews();

        // GET THE TEAM
        objectTeam.getTeam(idTeam, new Team.Callback() {
            public void onSuccess(Map<String, Object> options) throws JSONException {
                JSONObject json = (JSONObject) options.get("team");
                String color = json.getString("color");

                com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_team_input, null);
                input.setHint(json.getString("teamName"));
                input.setFloatingLabelText("");
                input.setBackgroundColor(Color.parseColor(color));
                input.setId(iterator);

                boxTeam.addView(input);

                // GET PLAYERS OF THE TEAM
                objectTeam.getTeamPlayers(idTeam, new Team.Callback() {
                    public void onSuccess(Map<String, Object> options) throws JSONException {
                        JSONArray json = (JSONArray) options.get("players");

                        int nbPlayers = json.length();

                        // LOOP ON PLAYERS
                        for (int j = 0; j < nbPlayers; j++) {
                            com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_player_input, null);
                            JSONObject player = new JSONObject(json.getString(j));
                            input.setHint(player.getString("playerName"));

                            LinearLayout.LayoutParams inputPlayerParams = new  LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                            inputPlayerParams.setMargins(50, 50, 50, 0);
                            input.setLayoutParams(inputPlayerParams);

                            input.setKeyListener(null);
                            input.setPrimaryColor(Color.parseColor("#ABAECD"));
                            boxTeam.addView(input);
                        }

                        // RUN UI ON MAIN THREAD
                        runOnUiThread(new Runnable() {
                            public void run() {
                                boxContentTeam.addView(boxTeam);
                            }
                        });

                        // RECURSIVE CALL IF IST NOT THE LAST TEAM
                        if(iterator < nbTeams - 1){
                            drawTeam(iterator + 1, nbTeams, teams);
                        }
                    }
                });
            }
        });
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_render_random_team, menu);
        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
