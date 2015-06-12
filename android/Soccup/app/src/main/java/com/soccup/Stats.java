package com.soccup;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import com.soccup.models.League;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class Stats extends Activity {

    private League league = new League();
    private String tournament;
    private String idTournament;
    private String idLeague;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.current_classement);

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
                    int nbTeams = teamsInOrder.length();

                    for(int i = 0; i < nbTeams; i++){
                        JSONObject team = teamsInOrder.getJSONObject(i);
                        showTeam(team, i);
                    }
                }
            });

        }

    }

    private void showTeam(final JSONObject team, int i) {
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
                        /*finalNbPlayed.setText(team.getString("played"));
                        finalNbWon.setText(team.getString("won"));
                        finalNbLost.setText(team.getString("lost"));
                        finalNbDrawn.setText(team.getString("drawn"));
                        finalDifference.setText(team.getString("gd"));
                        finalPts.setText(team.getString("pts"));*/

                        tab.addView(teamTpl);
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_stats, menu);
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
