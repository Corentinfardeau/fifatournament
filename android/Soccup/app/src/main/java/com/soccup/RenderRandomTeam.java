package com.soccup;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
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
import java.util.HashMap;
import java.util.Map;


public class RenderRandomTeam extends ActionBarActivity {
    private String tournament;
    private String idTournament;
    private Api api = new Api();
    private String idLeague;
    private int nbTeams;
    private JSONArray teams;

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
                        api.getTeam(idTeam, new Api.ApiCallback() {

                            public void onFailure(String error) { Log.d("GET TEAM", error); }

                            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                                String data = response.body().string();
                                JSONObject team = new JSONObject(data);

                                String teamName;
                                if(input.getText().toString().isEmpty()) teamName = team.getString("teamName");
                                else teamName = input.getText().toString();

                                // OPTIONS OF TEAM UPDATE ACTION
                                Map<String,Object> options = new HashMap<String, Object>();
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

                                // UPDATE NAME OF THE TEAM
                                api.updateTeam(options, new Api.ApiCallback() {

                                    public void onFailure(String error) { Log.d("UPDATE TEAM", error); }

                                    public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {

                                        // IF ITS THE LAST TEAM START THE NEW ACTIVITY
                                        if(finalI == nbTeams - 1){
                                            Intent intent = new Intent(RenderRandomTeam.this, CurrentTournament.class);

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
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }
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
                getCurrentTournament(idTournament);
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private void getCurrentTournament(String idTournament) {
        final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);

        // GET CURRENT TOURNAMENT
        api.getTournamentById(idTournament, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Get Tournament", error);}

            public void onSuccess(Response response) throws IOException, JSONException {
                String data = response.body().string();
                final JSONObject json = new JSONObject(data);

                // TEAMS
                teams = json.getJSONArray("teams");
                nbTeams = teams.length();
                int iterator = 0;

                // RECURSIVE FUNCTION TO GET THE TEAM AND DRAW IT
                drawTeam(iterator, nbTeams, teams);
            }
        });
    }

    private void drawTeam(final int iterator, final int nbTeams, final JSONArray teams) throws JSONException {
        final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);
        final LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);
        final String idTeam = teams.getString(iterator);
        LinearLayout.LayoutParams boxTeamParams = new  LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        boxTeamParams.setMargins(0,30,0,30);
        boxTeam.setLayoutParams(boxTeamParams);

        boxTeam.removeAllViews();

        // GET THE TEAM
        api.getTeam(idTeam, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Get Teams", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject json = new JSONObject(data);
                String color = json.getString("color");

                com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_team_input, null);
                    input.setHint(json.getString("teamName"));
                    input.setFloatingLabelText("");
                    input.setBackgroundColor(Color.parseColor(color));
                    input.setId(iterator);

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

                            LinearLayout.LayoutParams inputPlayerParams = new  LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                            inputPlayerParams.setMargins(50, 50, 50, 0);
                            input.setLayoutParams(inputPlayerParams);

                            input.setKeyListener(null);
                            input.setPrimaryColor(Color.parseColor("#ABAECD"));
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
