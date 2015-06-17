package com.soccup.activities;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Valentin on 04/06/2015.
 */
public class CreateManualTeam extends AppCompatActivity {
    private String tournament;
    private String idTournament;
    private String idLeague;

    // MODELS
    private Team objectTeam = new Team();
    private Tournament objectTournament = new Tournament();

    private Button btnCreateTeam;
    private JSONArray teams;
    private int nbTeams;
    private int inputsEmpty = 0;
    private Boolean hideDialog = true;
    private Toolbar mToolbar;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        // COMPONENTS
        btnCreateTeam = (Button)findViewById(R.id.btnCreateTeam);

        // TOOLBAR
        mToolbar = (Toolbar) findViewById(R.id.tool_bar);
        setSupportActionBar(mToolbar);
        // SHOW NAVIGATION BACK
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.arrow_back);

        // EXTRAS
        Bundle extras = getIntent().getExtras();

        // CREATE TEAMS ON CLICK
        btnCreateTeam.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                inputsEmpty = 0;
                hideDialog = true;
                final ArrayList<String> players = new ArrayList<String>();

                for(int i = 0; i < nbTeams; i++){
                    final int finalI = i;
                    final String idTeam;
                    final com.rengwuxian.materialedittext.MaterialEditText inputTeam = (com.rengwuxian.materialedittext.MaterialEditText) findViewById(i);

                    try {
                        idTeam = teams.getString(i);
                        final int finalI1 = i;

                        // GET THE TEAM
                        objectTeam.getTeam(idTeam, new Team.Callback() {
                            public void onSuccess(Map<String, Object> optionsTeam) throws JSONException {
                                JSONObject team = (JSONObject) optionsTeam.get("team");
                                String teamName;

                                // SET THE TEAM NAME
                                if(!inputTeam.getText().toString().isEmpty()) teamName = inputTeam.getText().toString();
                                else teamName = team.getString("teamName");

                                // LOOP ON TEAM PLAYERS
                                for(int j = 0; j < team.getInt("nbPlayers"); j++){
                                    int id = Integer.parseInt("100" + finalI + "" + (j + 1));

                                    com.rengwuxian.materialedittext.MaterialEditText inputPlayer = (com.rengwuxian.materialedittext.MaterialEditText) findViewById(id);

                                    if(inputPlayer.getText().toString().isEmpty()){  inputsEmpty ++; }
                                    else{  players.add("\""+ inputPlayer.getText().toString() + "\""); }

                                }

                                // THIS IS THE LAST TEAM
                                if(finalI == nbTeams - 1 && inputsEmpty == 0){

                                    // BUILD OPTIONS
                                    Map<String, Object> optionsPlayers = new HashMap<String, Object>();
                                    optionsPlayers.put("idTournament", idTournament);
                                    optionsPlayers.put("players", players);

                                    // CREATE PLAYERS
                                    objectTournament.createPlayers(optionsPlayers, new Tournament.Callback() {
                                        public void onSuccess(Map<String, Object> options) throws JSONException {
                                            startNextActivity();
                                        }
                                    });
                                }

                                // NO INPUT EMPTY
                                if(inputsEmpty == 0){

                                    // OPTIONS TO UPDATE TEAM
                                    final Map<String,Object> options = new HashMap<String, Object>();
                                    options.put("played", team.getInt("played"));
                                    options.put("idTeam", team.getString("_id"));
                                    options.put("teamName", teamName);
                                    options.put("won", team.getInt("won"));
                                    options.put("lost", team.getInt("lost"));
                                    options.put("drawn", team.getInt("drawn"));
                                    options.put("gf", team.getInt("gf"));
                                    options.put("ga", team.getInt("ga"));
                                    options.put("gd", team.getInt("gd"));
                                    options.put("pts", team.getInt("pts"));

                                    // UPDATE TEAM
                                    objectTeam.updateTeam(options, new Team.Callback() {
                                        public void onSuccess(Map<String, Object> options) throws JSONException { }
                                    });
                                }

                                // SHOW MESSAGE OF ERROR
                                else if(hideDialog){

                                    // RUN UI
                                    runOnUiThread(new Runnable() {
                                        public void run() {
                                            AlertDialog.Builder builder = new AlertDialog.Builder(CreateManualTeam.this)
                                                    .setTitle("Erreur")
                                                    .setMessage("Vous devez remplir tous les champs")
                                                    .setPositiveButton("Ok", null);
                                            AlertDialog dialog = builder.create();
                                            dialog.show();
                                        }
                                    });

                                    hideDialog = false;
                                }
                            }
                        });

                    } catch (JSONException e) { e.printStackTrace(); }
                }
            }
        });

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                JSONObject json = new JSONObject(tournament);
                idTournament = json.getString("_id");

                // GET THE CURRENT TOURNAMENT
                objectTournament.getTournament(idTournament, new Tournament.Callback() {
                    public void onSuccess(Map<String, Object> options) throws JSONException {
                        JSONObject json = (JSONObject) options.get("tournament");

                        // TEAMS
                        teams = json.getJSONArray("teams");
                        nbTeams = teams.length();
                        int iterator = 0;

                        // DRAW THE TEAM
                        drawTeam(iterator, nbTeams, teams);
                    }
                });

            } catch (JSONException e) { e.printStackTrace();  }
        }
    }

    private void drawTeam(final int iterator, final int nbTeams, final JSONArray teams) throws JSONException {
        final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);
        final LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);
        final String idTeam = teams.getString(iterator);

        LinearLayout.LayoutParams boxTeamParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        boxTeamParams.setMargins(0,30,0,30);
        boxTeam.setLayoutParams(boxTeamParams);

        // GET THE TEAM
        objectTeam.getTeam(idTeam, new Team.Callback() {
            public void onSuccess(Map<String, Object> options) throws JSONException {
                JSONObject jsonData = (JSONObject) options.get("team");
                String color = jsonData.getString("color");

                // CREATE INPUT FOR TEAM
                com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_team_input, null);
                input.setHint(jsonData.getString("teamName"));
                input.setFloatingLabelText("");
                input.setBackgroundColor(Color.parseColor(color));
                input.setId(iterator);

                boxTeam.addView(input);

                // LOOP OF NBPLAYERS
                for (int j = 0; j < jsonData.getInt("nbPlayers"); j++) {
                    input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_player_input, null);
                    input.setHint("Joueur " + (j + 1));
                    input.setFloatingLabelText("Joueur " + (j + 1));
                    int id = Integer.parseInt("100" + iterator + "" + (j + 1));
                    input.setId(id);

                    LinearLayout.LayoutParams inputPlayerParams = new  LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                    inputPlayerParams.setMargins(50, 50, 50, 0);
                    input.setLayoutParams(inputPlayerParams);

                    boxTeam.addView(input);
                }

                // RUN UI
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

    private void startNextActivity() {
        // LAUNCH NEW ACTIVITY
        Intent intent = new Intent(CreateManualTeam.this, CurrentTournamentActivity.class);

        // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
        intent.putExtra("TOURNAMENT", tournament);
        intent.putExtra("LEAGUE", idLeague);

        startActivity(intent);
        overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
    }


    public boolean onCreateOptionsMenu(Menu menu) {
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
