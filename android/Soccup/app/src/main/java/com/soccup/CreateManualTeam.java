package com.soccup;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.soccup.models.Api;
import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
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
    private Api api = new Api();
    private Button btnCreateTeam;
    private JSONArray teams;
    private int nbTeams;
    private int inputsEmpty = 0;
    private Boolean hideDialog = true;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        Bundle extras = getIntent().getExtras();
        btnCreateTeam = (Button)findViewById(R.id.btnCreateTeam);

        // BTN CREATE EVENT
        btnCreateTeam.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                final ArrayList<String> players = new ArrayList<String>();

                for(int i = 0; i < nbTeams; i++){
                    final int finalI = i;
                    final String idTeam;
                    final com.rengwuxian.materialedittext.MaterialEditText inputTeam = (com.rengwuxian.materialedittext.MaterialEditText) findViewById(i);

                    try {
                        idTeam = teams.getString(i);
                        final int finalI1 = i;

                        // GET THE TEAMs
                        api.getTeam(idTeam, new Api.ApiCallback() {

                            public void onFailure(String error) { Log.d("Get Teams", error); }

                            public void onSuccess(Response response) throws IOException, JSONException {
                                String data = response.body().string();
                                JSONObject team = new JSONObject(data);

                                String teamName;
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
                                if(finalI == nbTeams - 1){

                                    // BUILD OPTIONS
                                    Map<String, Object> optionsPlayers = new HashMap<String, Object>();
                                    optionsPlayers.put("idTournament", idTournament);
                                    optionsPlayers.put("players", players);

                                    // CREATE PLAYERS
                                    createPlayers(optionsPlayers);
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
                                    api.updateTeam(options, new Api.ApiCallback() {
                                        public void onFailure(String error) { Log.d("UPDATE TEAM", error);}
                                        public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {}
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
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }
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
                getCurrentTournament(idTournament);

            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private void getCurrentTournament(String idTournament) {

        // GET THE CURRENT TOURNAMENT
        api.getTournamentById(idTournament, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Get Tournament", error);}

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                final JSONObject json = new JSONObject(data);

                // TEAMS
                teams = json.getJSONArray("teams");
                nbTeams = teams.length();
                int iterator = 0;

                // DRAW THE TEAM
                drawTeam(iterator, nbTeams, teams);
            }
        });
    }

    private void drawTeam(final int iterator, final int nbTeams, final JSONArray teams) throws JSONException {
        final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);
        final LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);
        final String idTeam = teams.getString(iterator);

        LinearLayout.LayoutParams boxTeamParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        boxTeamParams.setMargins(0,30,0,30);
        boxTeam.setLayoutParams(boxTeamParams);

        // GET THE TEAM
        api.getTeam(idTeam, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Get Teams", error); }

            public void onSuccess(Response response) throws IOException, JSONException {
                String data = response.body().string();
                Log.d("MY TEAM", data);
                JSONObject jsonData = new JSONObject(data);
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


    private void createPlayers(Map<String, Object> optionsPlayers) {
        api.createPlayers(optionsPlayers, new Api.ApiCallback() {
            public void onFailure(String error) {
                Log.d("Create Players", error);
            }
            public void onSuccess(Response response) throws IOException, JSONException { startNextActivity(); }
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
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
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
