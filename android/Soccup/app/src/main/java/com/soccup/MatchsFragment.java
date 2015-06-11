package com.soccup;

import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Valentin on 11/06/2015.
 */
public class MatchsFragment extends Fragment {
    private static final String ARG_POSITION = "position";
    private int position;
    private View view;
    private LayoutInflater mInflater;
    private String tournament;
    private String idLeague;
    private String idTournament;
    private Api api = new Api();

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        position = getArguments().getInt(ARG_POSITION);
    }

    public View onCreateView(LayoutInflater inflater,ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_matchs, container, false);
        LinearLayout matchs = (LinearLayout) view.findViewById(R.id.matchs);
        mInflater = inflater;

        CurrentTournamentActivity activity = (CurrentTournamentActivity) getActivity();
        Bundle extras = activity.getExtras();

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                JSONObject dataTournament = new JSONObject(tournament);
                idTournament = dataTournament.getString("_id");

                // GET THE LEAGUE
                getLeague(new Callback() {
                    public void onSuccess(Map<String, Object> options) throws JSONException {
                        JSONObject league = (JSONObject) options.get("league");
                        JSONArray firstLeg = league.getJSONArray("firstLeg");
                        final JSONArray returnLeg = league.getJSONArray("returnLeg");
                        final int nbFirstLegMatch = firstLeg.length();
                        final int nbReturnLegMatch = returnLeg.length();
                        final ArrayList matchs = new ArrayList();

                        // GET THE MATCH OF THE FIRSTLEG
                        for(int i = 0; i < nbFirstLegMatch; i++){
                            JSONObject myMatch = (JSONObject)firstLeg.getJSONObject(i);
                            String idMatch = myMatch.getString("_id");

                            // GET MATCH
                            getMatch(idMatch, new Callback() {
                                public void onSuccess(Map<String, Object> options) throws JSONException {
                                    JSONObject match = (JSONObject) options.get("match");
                                    matchs.add(match);

                                    // WE HAVE ALL OF THE MATCHS OF FIRSTLEG
                                    if(nbFirstLegMatch == matchs.size()){
                                        // GET THE MATCH OF THE RETURN LEG
                                        for(int i = 0; i < nbReturnLegMatch; i++){
                                            JSONObject myMatch = (JSONObject)returnLeg.getJSONObject(i);
                                            String idMatch = myMatch.getString("_id");

                                            // GET MATCH
                                            getMatch(idMatch, new Callback() {
                                                public void onSuccess(Map<String, Object> options) throws JSONException {
                                                    JSONObject match = (JSONObject) options.get("match");
                                                    matchs.add(match);

                                                    if(matchs.size() == nbReturnLegMatch + nbFirstLegMatch){
                                                        showMatchs(matchs);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
            catch (JSONException e){e.printStackTrace();}
        }

        return view;
    }

    private void showMatchs(ArrayList matchs) throws JSONException {
        int nbMatchs = matchs.size();
        final LinearLayout layout = (LinearLayout) view.findViewById(R.id.matchs);
        Boolean inPlay = false;
        TextView scoreTeamHome = null;
        TextView scoreTeamAway = null;
        TextView teamHome = null;
        TextView teamAway = null;

        for(int i = 0; i< nbMatchs; i++){
            final JSONObject match = (JSONObject) matchs.get(i);
            final LinearLayout matchTpl = (LinearLayout) mInflater.inflate(R.layout.match, null);
            TextView typeMatch = (TextView) matchTpl.getChildAt(0);
            LinearLayout scores = (LinearLayout) matchTpl.getChildAt(1);
            LinearLayout teamsName = (LinearLayout) matchTpl.getChildAt(2);
            final LinearLayout.LayoutParams cardMatch = new  LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            cardMatch.setMargins(50, 50, 50, 0);

            // LOOP ON SCORES
            int countScore = scores.getChildCount();
            for (int j = 0; j < countScore; j++) {
                View v = scores.getChildAt(j);

                switch (v.getId()){
                    case R.id.scoreTeamHome:
                        scoreTeamHome = (TextView) v;
                        break;

                    case R.id.scoreTeamAway:
                        scoreTeamAway = (TextView) v;
                        break;
                }
            }

            if (scoreTeamHome != null) {
                scoreTeamHome.setText(Integer.toString(match.getInt("goalHomeTeam")));
            }
            if (scoreTeamAway != null) {
                scoreTeamAway.setText(Integer.toString(match.getInt("goalAwayTeam")));
            }

            // LOOP ON TEAMS NAMES
            int countTeam = teamsName.getChildCount();
            for (int j = 0; j < countTeam; j++) {
                View v = teamsName.getChildAt(j);

                switch (v.getId()){
                    case R.id.teamHome:
                        teamHome = (TextView) v;
                        break;

                    case R.id.teamAway:
                        teamAway = (TextView) v;
                        break;
                }
            }

            if(i < nbMatchs / 2){
                typeMatch.setText("Match aller");
            }
            else {
                typeMatch.setText("Match retour");
            }
            final TextView finalScoreTeamHome = scoreTeamHome;
            final TextView finalScoreTeamAway = scoreTeamAway;

            // GET TEAM HOME
            final TextView finalTeamHome = teamHome;
            final TextView finalTeamAway = teamAway;

            getTeam(match.getString("homeTeam"), new Callback() {
                public void onSuccess(Map<String, Object> options) throws JSONException {
                    final JSONObject homeTeam = (JSONObject) options.get("team");

                    // GET TEAM AWAY
                    getTeam(match.getString("awayTeam"), new Callback() {
                        public void onSuccess(Map<String, Object> options) throws JSONException {
                            final JSONObject awayTeam = (JSONObject) options.get("team");

                            getActivity().runOnUiThread(new Runnable() {
                                public void run() {
                                    try {
                                        finalScoreTeamHome.setTextColor(Color.parseColor(homeTeam.getString("color")));
                                        finalScoreTeamAway.setTextColor(Color.parseColor(awayTeam.getString("color")));
                                        finalTeamHome.setText(homeTeam.getString("teamName"));
                                        finalTeamAway.setText(awayTeam.getString("teamName"));
                                    }
                                    catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                    matchTpl.setLayoutParams(cardMatch);
                                    layout.addView(matchTpl);
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    private void getTeam(String idTeam, final Callback cb) {
        api.getTeam(idTeam, new Api.ApiCallback() {
            public void onFailure(String error) { Log.d("GET TEAM", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject team = new JSONObject(data);
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("team", team);
                cb.onSuccess(options);
            }
        });
    }

    private void getMatch(String idMatch, final Callback cb) {
        api.getMatch(idMatch, new Api.ApiCallback() {
            public void onFailure(String error) {Log.d("GET MATCH", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                Log.d("MATCH", data);
                JSONObject match = new JSONObject(data);
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("match", match);
                cb.onSuccess(options);
            }
        });
    }

    private void getLeague(final Callback cb) {
        api.getLeague(idLeague, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET THE LEAGUE", error);}

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                Log.d("LEAGUE", data);
                JSONObject league = new JSONObject(data);
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("league", league);
                cb.onSuccess(options);
            }
        });
    }

    public static Fragment newInstance(int index) {
        MatchsFragment f = new MatchsFragment();
        Bundle b = new Bundle();
        b.putInt(ARG_POSITION, index);
        f.setArguments(b);
        return f;
    }

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
