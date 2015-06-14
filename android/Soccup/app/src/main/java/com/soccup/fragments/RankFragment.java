package com.soccup.fragments;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import com.soccup.activities.CurrentTournamentActivity;
import com.soccup.R;
import com.soccup.models.League;
import com.soccup.models.Team;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Valentin on 11/06/2015.
 */
public class RankFragment extends Fragment {

    private static final String ARG_POSITION = "position";
    private int position;
    private LayoutInflater mInflater;

    // MODELS
    private League league = new League();
    private Team teamObject = new Team();

    private String tournament;
    private String idLeague;
    private View view;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        position = getArguments().getInt(ARG_POSITION);
    }

    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.current_classement, container, false);
        mInflater = inflater;

        CurrentTournamentActivity activity = (CurrentTournamentActivity) getActivity();
        Bundle extras = activity.getExtras();

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            // BUILD OPTIONS TO GET LEAGUE RANKING
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

                        // SHOW TEAM
                        showTeam(team, i + 1);

                        // GET TEAM PLAYERS
                        teamObject.getTeamPlayers(team.getString("_id"), new Team.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                JSONArray playersTeam = (JSONArray) options.get("players");

                                for(int j = 0; j < playersTeam.length(); j++){
                                    JSONObject player = (JSONObject) playersTeam.get(j);
                                    players.add(player);

                                    // WHEN ITS THE LAST PLAYER
                                    if(finalI == (nbTeams - 1)){

                                        // SHOW PLAYERS
                                        showPlayers(players);
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }

        return view;
    }

    private void showPlayers(ArrayList players) throws JSONException {
        int maxGoal = -1;
        int minGoal = 10000;
        JSONObject topPlayer = null;
        JSONObject flopPlayer = null;

        for(int i = 0; i< players.size(); i++){
            JSONObject player = (JSONObject) players.get(i);

            // PLAYER FLOP
            if(player.getInt("nbGoal") < minGoal){
                minGoal = player.getInt("nbGoal");
                flopPlayer = player;
            }

            // PLAYER TOP
            if(player.getInt("nbGoal") > maxGoal){
                maxGoal = player.getInt("nbGoal");
                topPlayer = player;
                Log.d("max", "max");
            }
        }

        final TextView bestplayer = (TextView) view.findViewById(R.id.nameBestPlayer);
        final TextView badPlayer = (TextView) view.findViewById(R.id.nameBadPlayer);

        final int finalMaxGoal = maxGoal;
        final int finalMinGoal = minGoal;
        final JSONObject finalTopPlayer = topPlayer;
        final JSONObject finalFlopPlayer = flopPlayer;
        final String[] sBest = new String[1];
        final String[] sBad = new String [1];

        // RUN UI ON MAIN THREAD
        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                if (finalMaxGoal > 1) sBest[0] = "s"; else sBest[0] = "";
                if (finalMinGoal > 1) sBad[0] = "s"; else sBad[0] = "";

                try {
                    bestplayer.setText(finalTopPlayer.getString("playerName") + " " + finalMaxGoal + " but" + sBest[0]);
                    badPlayer.setText(finalFlopPlayer.getString("playerName") + " " + finalMinGoal + " but" + sBad[0]);

                } catch (JSONException e) { e.printStackTrace(); }
            }
        });

    }

    private void showTeam(final JSONObject team, final int rank) {
        final LinearLayout winner = (LinearLayout) view.findViewById(R.id.winner);

        final TableLayout tab = (TableLayout) view.findViewById(R.id.tableRanking);
        final TableRow teamTpl = (TableRow) mInflater.inflate(R.layout.add_new_team_ranking, null);

        int countData = teamTpl.getChildCount();
        TextView name = null;
        TextView nbPlayed= null;
        TextView nbWon= null;
        TextView nbDrawn= null;
        TextView nbLost= null;
        TextView difference= null;
        TextView pts= null;

        // GET TEAM COMPONENTS
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

        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                try {
                    if (rank % 2 == 0) teamTpl.setBackgroundColor(0xFFFFFFFF);
                    finalName.setText(team.getString("teamName"));
                    finalNbPlayed.setText(team.getString("played"));
                    finalNbWon.setText(team.getString("won"));
                    finalNbLost.setText(team.getString("lost"));
                    finalNbDrawn.setText(team.getString("drawn"));
                    finalDifference.setText(team.getString("gd"));
                    finalPts.setText(team.getString("pts"));
                    winner.removeAllViews();

                    tab.addView(teamTpl);

                }  catch (JSONException e) {  e.printStackTrace();  }
            }
        });
    }

    // INSTANCE
    public static Fragment newInstance(int index) {
        RankFragment f = new RankFragment();
        Bundle b = new Bundle();
        b.putInt(ARG_POSITION, index);
        f.setArguments(b);
        return f;
    }
}