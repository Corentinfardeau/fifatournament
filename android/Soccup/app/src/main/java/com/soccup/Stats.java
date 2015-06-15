package com.soccup;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import com.soccup.models.League;
import com.soccup.models.Team;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class Stats extends AppCompatActivity {
    private League league = new League();
    private Team teamObject = new Team();
    private String tournament;
    private String idTournament;
    private String idLeague;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.current_classement);

        //COME BACK VICTORY
        ImageButton backVictory = (ImageButton) findViewById(R.id.backVictory);
        backVictory.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                Intent intent = new Intent(Stats.this, Victory.class);
                startActivity(intent);
                // overridePendingTransition(R.anim.slide_begin_right, R.anim.slide_finish_left);
            }
        });

        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            // BUILD OPTIONS
            Map<String, Object> options = new HashMap<String, Object>();
            options.put("idLeague", idLeague);
            options.put("order_by", "classic");

            // GET RANKING LEAGUE
            league.getRankingLeague(options, new League.Callback() {
                public void onSuccess(Map<String, Object> options) throws JSONException {
                    JSONArray teamsInOrder = (JSONArray)options.get("teams");
                    final int nbTeams = teamsInOrder.length();
                    final ArrayList players = new ArrayList();

                    for(int i = 0; i < nbTeams; i++){
                        final int finalI = i;
                        JSONObject team = teamsInOrder.getJSONObject(i);
                        showTeam(team, i + 1);

                        // GET TEAM PLAYERS
                        teamObject.getTeamPlayers(team.getString("_id"), new Team.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                JSONArray playersTeam = (JSONArray) options.get("players");
                                Log.d("GET TEAM STATS", playersTeam.toString());

                                for(int j = 0; j < playersTeam.length(); j++){
                                    JSONObject player = (JSONObject) playersTeam.get(j);
                                    players.add(player);

                                    if(finalI == (nbTeams - 1)){
                                        showPlayers(players);
                                    }
                                }
                            }
                        });

                    }
                }
            });

        }

    }

    private void showPlayers(ArrayList players) throws JSONException {
        int maxGoal = -1;
        int minGoal = 10000;
        JSONObject topPlayer = null;
        JSONObject flopPlayer = null;

        for(int i = 0; i< players.size(); i++){
            JSONObject player = (JSONObject) players.get(i);

            if(player.getInt("nbGoal") < minGoal){
                minGoal = player.getInt("nbGoal");
                flopPlayer = player;
            }

            if(player.getInt("nbGoal") > maxGoal){
                maxGoal = player.getInt("nbGoal");
                topPlayer = player;
            }
        }

        final TextView bestplayer = (TextView) findViewById(R.id.nameBestPlayer);
        final TextView badPlayer = (TextView) findViewById(R.id.nameBadPlayer);

        final int finalMaxGoal = maxGoal;
        final int finalMinGoal = minGoal;
        final JSONObject finalTopPlayer = topPlayer;
        final JSONObject finalFlopPlayer = flopPlayer;
        final String[] sBest = new String[1];
        final String[] sBad = new String [1];

        // RUN UI
        runOnUiThread(new Runnable() {
            public void run() {
                try {
                    if(finalMaxGoal > 1) sBest[0] = "s"; else sBest[0] = "";
                    if(finalMinGoal > 1) sBad[0] = "s"; else sBad[0] = "";
                    bestplayer.setText(finalTopPlayer.getString("playerName") + " " + finalMaxGoal + " but" + sBest[0]);
                    badPlayer.setText(finalFlopPlayer.getString("playerName") + " " + finalMinGoal + " but" + sBad[0]);
                }
                catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

    }

    private void showTeam(final JSONObject team, final int rank) {

        // THE BEST TEAM OF THE TOURNAMENT
        if(rank == 1){
            final TextView teamVictory = (TextView) findViewById(R.id.teamVictory);

            runOnUiThread(new Runnable() {
                public void run() {
                    try {  teamVictory.setText(team.getString("teamName")); }
                    catch (JSONException e) {  e.printStackTrace(); }
                }
            });
        }


        final TableLayout tab = (TableLayout) findViewById(R.id.tableRanking);
        final TableRow teamTpl = (TableRow) getLayoutInflater().inflate(R.layout.add_new_team_ranking, null);

        int countData = teamTpl.getChildCount();
        TextView name = null;
        TextView nbPlayed= null;
        TextView nbWon= null;
        TextView nbDrawn= null;
        TextView nbLost= null;
        TextView difference= null;
        TextView pts= null;

        for(int j = 0; j< countData; j++){
            View v = teamTpl.getChildAt(j);

            switch (v.getId()){
                case R.id.teamRanking:
                    name = (TextView) v;
                    break;

                case R.id.nbMatchPlayed:
                    nbPlayed = (TextView) v;
                    break;

                case R.id.nbMatchWon:
                    nbWon = (TextView) v;
                    break;

                case R.id.nbMatchDrawn:
                    nbDrawn = (TextView) v;
                    break;

                case R.id.nbMatchLose:
                    nbLost = (TextView) v;
                    break;

                case R.id.differentGoal:
                    difference = (TextView) v;
                    break;

                case R.id.nbPoints:
                    pts = (TextView) v;
                    break;
            }
        }

        final TextView finalName = name;
        final TextView finalNbPlayed = nbPlayed;
        final TextView finalNbWon = nbWon;
        final TextView finalNbLost = nbLost;
        final TextView finalNbDrawn = nbDrawn;
        final TextView finalDifference = difference;
        final TextView finalPts = pts;

        runOnUiThread(new Runnable() {
            public void run() {
                try {
                    finalName.setText(team.getString("teamName"));
                    finalNbPlayed.setText(team.getString("played"));
                    finalNbWon.setText(team.getString("won"));
                    finalNbLost.setText(team.getString("lost"));
                    finalNbDrawn.setText(team.getString("drawn"));
                    finalDifference.setText(team.getString("gd"));
                    finalPts.setText(team.getString("pts"));

                    if(rank % 2 == 0) teamTpl.setBackgroundColor(0xFFFFFFFF);

                    tab.addView(teamTpl);
                }
                catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });


    }

    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_stats, menu);
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
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
