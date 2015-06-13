package com.soccup;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Point;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.animation.TranslateAnimation;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.TextView;

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
 * Created by Valentin on 11/06/2015.
 */

public class CurrentMatchFragment extends Fragment {
    private static final String ARG_POSITION = "position";
    private int position;
    private String tournament;
    private String idTournament;
    private String idLeague;
    private JSONObject currentMatch;
    private String idCurrentMatch;
    private JSONArray firstLeg;
    private JSONArray returnLeg;
    private Api api = new Api();
    private Button btnMatchNext;
    private int screenWidth;
    private int screenHeight;
    private PopupWindow popup;
    private View view;
    private LayoutInflater mInflater;
    private ViewGroup mContainer;

    public static Fragment newInstance(int index) {
        CurrentMatchFragment f = new CurrentMatchFragment();
        Bundle b = new Bundle();
        b.putInt(ARG_POSITION, index);
        f.setArguments(b);
        return f;
    }

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        position = getArguments().getInt(ARG_POSITION);
    }

    public View onCreateView(LayoutInflater inflater,ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_current_match, container, false);
        mInflater = inflater;
        mContainer = container;

        CurrentTournamentActivity activity = (CurrentTournamentActivity) getActivity();
        Bundle extras = activity.getExtras();

        btnMatchNext = (Button) view.findViewById(R.id.btnMatchNext);

        // GET SCREEN WIDTH
        Display display = getActivity().getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        screenWidth = size.x;
        screenHeight = size.y;

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                JSONObject dataTournament = new JSONObject(tournament);
                idTournament = dataTournament.getString("_id");

                // GET THE LEAGUE
                getLeague(idLeague, new Callback() {
                    public void onSuccess(Map<String, Object> options) throws JSONException {

                        // GET THE MATCH
                        getMatch(idCurrentMatch, new Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                ArrayList teams = (ArrayList) options.get("teams");

                                // SHOW THE MATCH
                                showMatch(teams, null, "aller");
                            }
                        });
                    }
                });

            }
            catch (JSONException e) {   e.printStackTrace();  }
        }

        // EVENT ON BTNMATCHNEXT
        // CREATE A NEW MATCH
        btnMatchNext.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(idCurrentMatch != null) {
                    final Map<String, Object> options = new HashMap<String, Object>();

                    try {
                        options.put("idMatch", idCurrentMatch);
                        options.put("played", true);
                        options.put("goalAwayTeam", currentMatch.getInt("goalAwayTeam"));
                        options.put("goalHomeTeam", currentMatch.getInt("goalHomeTeam"));
                    }
                    catch (JSONException e) { e.printStackTrace();  }

                    // UPDATE MATCH
                    updateMatch(options, new Callback() {
                        public void onSuccess(final Map<String, Object> matchUpdated) throws JSONException {
                            final JSONObject match = (JSONObject) matchUpdated.get("match");
                            JSONObject awayTeam;

                            // GET THE TEAMS
                            getTeam(match.getString("homeTeam"), new Callback() {
                                public void onSuccess(Map<String, Object> options) throws JSONException {
                                    final JSONObject homeTeam = (JSONObject)options.get("team");

                                    getTeam(match.getString("awayTeam"), new Callback() {
                                        public void onSuccess(Map<String, Object> options) throws JSONException {
                                            final JSONObject awayTeam = (JSONObject)options.get("team");

                                            int ptsHome; final int ptsAway;
                                            int lostHome; final int lostAway;
                                            int wonHome; final int wonAway; int drawHome; final int drawnAway;
                                            int playedHome; final int playedAway;

                                            if(match.getInt("goalHomeTeam") > match.getInt("goalAwayTeam")){
                                                ptsHome = homeTeam.getInt("pts") + 3; ptsAway = awayTeam.getInt("pts");
                                                lostHome = homeTeam.getInt("lost"); lostAway = awayTeam.getInt("lost") + 1;
                                                wonHome = homeTeam.getInt("won") + 1; wonAway = awayTeam.getInt("won");
                                                drawHome = homeTeam.getInt("drawn"); drawnAway = awayTeam.getInt("drawn");
                                            }else if(match.getInt("goalHomeTeam") < match.getInt("goalAwayTeam")){
                                                ptsHome = homeTeam.getInt("pts"); ptsAway = awayTeam.getInt("pts") + 3;
                                                lostHome = homeTeam.getInt("lost") + 1; lostAway = awayTeam.getInt("lost");
                                                wonHome = homeTeam.getInt("won"); wonAway = awayTeam.getInt("won") + 1;
                                                drawHome = homeTeam.getInt("drawn"); drawnAway = awayTeam.getInt("drawn");
                                            }else{
                                                ptsHome = homeTeam.getInt("pts") + 1; ptsAway = awayTeam.getInt("pts") + 1;
                                                lostHome = homeTeam.getInt("lost"); lostAway = awayTeam.getInt("lost");
                                                wonHome = homeTeam.getInt("won"); wonAway = awayTeam.getInt("won");
                                                drawHome = homeTeam.getInt("drawn") + 1; drawnAway = awayTeam.getInt("drawn") + 1;
                                            }
                                            playedHome = homeTeam.getInt("played") + 1; playedAway = awayTeam.getInt("played") + 1;

                                            // UPDATE TEAM HOME
                                            Map<String, Object> optionHome = new HashMap<String, Object>();
                                            optionHome.put("played", playedHome);
                                            optionHome.put("idTeam", homeTeam.getString("_id"));
                                            optionHome.put("teamName", homeTeam.getString("teamName"));
                                            optionHome.put("won", wonHome);
                                            optionHome.put("lost",lostHome);
                                            optionHome.put("drawn", drawHome);
                                            optionHome.put("gf", homeTeam.getInt("gf"));
                                            optionHome.put("ga", homeTeam.getInt("ga"));
                                            optionHome.put("gd", homeTeam.getInt("gd"));
                                            optionHome.put("pts", ptsHome);

                                            updateTeam(optionHome, new Callback() {
                                                public void onSuccess(Map<String, Object> options) throws JSONException {

                                                    // UPDATE TEAM AWAY
                                                    Map<String, Object> optionAwway = new HashMap<String, Object>();
                                                    optionAwway.put("played", playedAway);
                                                    optionAwway.put("idTeam", awayTeam.getString("_id"));
                                                    optionAwway.put("teamName", awayTeam.getString("teamName"));
                                                    optionAwway.put("won", wonAway);
                                                    optionAwway.put("lost",lostAway);
                                                    optionAwway.put("drawn", drawnAway);
                                                    optionAwway.put("gf", awayTeam.getInt("gf"));
                                                    optionAwway.put("ga", awayTeam.getInt("ga"));
                                                    optionAwway.put("gd", awayTeam.getInt("gd"));
                                                    optionAwway.put("pts", ptsAway);

                                                    updateTeam(optionAwway, new Callback() {
                                                        public void onSuccess(Map<String, Object> options) throws JSONException {
                                                            matchUpdated.put("dataMatch", match);

                                                            // AND THEN LAUNCH A NEW MATCH
                                                            newMatch(matchUpdated);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });

        return view;
    }

    private void updateTeam(Map<String, Object> options, final Callback cb) {
        api.updateTeam(options, new Api.ApiCallback() {
            public void onFailure(String error) { Log.d("UPDATE TEAM", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                cb.onSuccess(new HashMap<String, Object>());
                Log.d("UPDATE TEAM FIN MATCH", data);
            }
        });
    }

    private void updateMatch(Map<String, Object> options, final Callback cb) {
        api.updateMatch(options, new Api.ApiCallback() {

            public void onFailure(String error) {
                Log.d("UPDATE MATCH", error);
            }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                Log.d("UPDATE MATCH", data);
                JSONObject dataMatch = new JSONObject(data);
                Map<String, Object> match = new HashMap<String, Object>();
                match.put("match", dataMatch);
                cb.onSuccess(match);
            }
        });
    }

    private void newMatch(Map<String, Object> options) throws JSONException {
        JSONObject dataMatch = (JSONObject) options.get("match");

        // NB MATCHS BY TURN
        int nbMatchs = firstLeg.length();
        Boolean played = true;

        // RESEARCH IN FIRSTLEG MATCHS
        for (int i = 0; i < nbMatchs; i++) {

            try {

                // UPDATE THE MATCH IN THE TABLE
                JSONObject match = new JSONObject(firstLeg.getString(i));
                JSONObject nextMatch = null;
                if(i < (nbMatchs - 1)) {nextMatch = new JSONObject(firstLeg.getString(i + 1));}
                if(match.getString("_id").equals(dataMatch.getString("_id"))){
                    match.put("played", true);
                    firstLeg.put(i, match);
                }

                // NEW MATCH
                if (match.getBoolean("played") == false){

                    // MATCH BECOME THE CURRENT MATCH
                    currentMatch = match;
                    idCurrentMatch = match.getString("_id");

                    // MATCH AFTER THE PRECEDENT
                    String idNextMatch = null;
                    if(nextMatch != null){ idNextMatch = nextMatch.getString("_id");  }

                    played = false;
                    final String finalIdNextMatch = idNextMatch;

                    // GET THE MATCH
                    getMatch(idCurrentMatch, new Callback() {
                        public void onSuccess(Map<String, Object> options) throws JSONException {
                            final ArrayList teams = (ArrayList) options.get("teams");

                            if(finalIdNextMatch != null) {
                                getMatch(finalIdNextMatch, new Callback() {
                                    public void onSuccess(Map<String, Object> options) throws JSONException {
                                        ArrayList nexTeam = (ArrayList) options.get("teams");

                                        // SHOW THE MATCH
                                        showMatch(teams, nexTeam, "retour");
                                    }
                                });
                            }else{

                                // SHOW THE MATCH
                                showMatch(teams, null, "retour");
                            }
                        }
                    });

                    break;
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        // ALL OF THE FIRST MATCH ARE PLAYED
        // RESEARCH IN RETURN MATCHS
        if (played == true) {
            for (int i = 0; i < nbMatchs; i++) {
                try {

                    // UPDATE THE MATCH IN THE TABLE
                    JSONObject match = new JSONObject(returnLeg.getString(i));
                    JSONObject nextMatch = null;
                    if(i < (nbMatchs - 1)) { nextMatch = new JSONObject(returnLeg.getString(i + 1));}
                    if(match.getString("_id").equals(dataMatch.getString("_id"))){
                        match.put("played", true);
                        returnLeg.put(i, match);
                    }

                    // NEW MATCH
                    if (match.getBoolean("played") == false) {

                        // MATCH BECOME THE CURRENT MATCH
                        currentMatch = match;
                        idCurrentMatch = match.getString("_id");

                        // MATCH AFTER THE PRECEDENT
                        String idNextMatch = null;
                        if(nextMatch != null){ idNextMatch = nextMatch.getString("_id");  }

                        // GET THE MATCH
                        final String finalIdNextMatch = idNextMatch;
                        getMatch(idCurrentMatch, new Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                final ArrayList teams = (ArrayList) options.get("teams");

                                if(finalIdNextMatch != null) {
                                    getMatch(finalIdNextMatch, new Callback() {
                                        public void onSuccess(Map<String, Object> options) throws JSONException {
                                            ArrayList nexTeam = (ArrayList) options.get("teams");

                                            // SHOW THE MATCH
                                            showMatch(teams, nexTeam, "retour");
                                        }
                                    });
                                }else{

                                    // SHOW THE MATCH
                                    showMatch(teams, null, "retour");
                                }
                            }
                        });

                        break;
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        // IF IT REST ONE MATCH TO PLAY
        if(checkMatchsPlayed() == 1) {
            getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    btnMatchNext.setText("TERMINER");
                }
            });
        }

        // NO MORE MATCH TO PLAY
        // TOURNAMENT CLOSE
        if(checkMatchsPlayed() == 0) {
            idCurrentMatch = null;

            // TOURNAMENT FINISHED
            tournamentFinished();

        }
    }

    private void tournamentFinished() {
        Intent intent = new Intent(getActivity(), Victory.class);

        // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
        intent.putExtra("TOURNAMENT", tournament);
        intent.putExtra("LEAGUE", idLeague);

        startActivity(intent);
        //overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
    }

    // CHECK IF ALL MATCHS ARE PLAYED
    private int checkMatchsPlayed() throws JSONException {
        int nbMatchs = firstLeg.length();
        int nbPlayed = 0;

        for (int i = 0; i < nbMatchs; i++) {
            JSONObject match = new JSONObject(firstLeg.getString(i));
            if(match.getBoolean("played") == true) nbPlayed ++;
        }

        for (int i = 0; i < nbMatchs; i++) {
            JSONObject match = new JSONObject(returnLeg.getString(i));
            if(match.getBoolean("played") == true) nbPlayed ++;
        }

        if(nbPlayed == (nbMatchs * 2)) return 0;
        else if(nbPlayed == (nbMatchs * 2) - 1) return 1;
        else return 2;
    }

    public void getLeague(String idLeague, final Callback cb){
        api.getLeague(idLeague, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET A LEAGUE", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject dataLeague = new JSONObject(data);

                // RETURN AND FIRST LEG
                firstLeg = dataLeague.getJSONArray("firstLeg");
                returnLeg = dataLeague.getJSONArray("returnLeg");

                // THE FIRST MATCH WITCH IS NOT PLAYED
                JSONObject myMatch = null;
                Boolean haveMatch = false;

                for(int i = 0; i < firstLeg.length(); i++){
                    JSONObject match = new JSONObject(firstLeg.getString(i));
                    if(haveMatch == false && match.getBoolean("played") == false){
                        myMatch = match;
                        haveMatch = true;
                        break;
                    }
                }

                for(int i = 0; i < returnLeg.length(); i++){
                    JSONObject match = new JSONObject(returnLeg.getString(i));
                    if(haveMatch == false && match.getBoolean("played") == false){
                        myMatch = match;
                        haveMatch = true;
                        break;
                    }
                }

                idCurrentMatch = myMatch.getString("_id");
                cb.onSuccess(new HashMap<String, Object>());
            }
        });
    }

    private void getMatch(String idCurrentMatch, final Callback cb) {
        api.getMatch(idCurrentMatch, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET CURRENT MATCH", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String dataMatch = response.body().string();
                currentMatch = new JSONObject(dataMatch);

                String idTeam;
                final ArrayList teams = new ArrayList();

                // GET THE TEAMS OF THE MATCH
                for(int i = 0; i < 2; i++){
                    final int finalI = i;

                    if(i == 0) idTeam = currentMatch.getString("homeTeam");
                    else idTeam = currentMatch.getString("awayTeam");

                    // GET A TEAM
                    api.getTeam(idTeam, new Api.ApiCallback() {

                        public void onFailure(String error) {
                            Log.d("GET TEAM", error);
                        }

                        public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                            String data = response.body().string();
                            JSONObject team = new JSONObject(data);
                            teams.add(team);

                            // IF ITS THE LAST TEAM OF THE MATCH, SHOW THE MATCH
                            if (teams.size() == 2) {
                                Map<String, Object> options = new HashMap<String, Object>();
                                options.put("teams", teams);
                                cb.onSuccess(options);
                            }
                        }
                    });
                }
            }
        });
    }

    private void showMatch(final ArrayList teams, final ArrayList nextTeam, String typeMatch) throws JSONException {

        // BUILD THE TWO TEAMS
        final JSONObject homeTeam = new JSONObject(teams.get(0).toString());
        final JSONObject awayTeam = new JSONObject(teams.get(1).toString());
        final JSONObject nextTeamHome;
        final JSONObject nextTeamAway;

        // VALUE TO SET
        TextView scoreTeamHome = null;
        TextView scoreTeamAway = null;
        TextView teamHome = null;
        TextView teamAway = null;
        Button goalHome = null;
        Button goalAway = null;

        // CONTENT OF THE CURRENT TOURNAMENT
        final LinearLayout content = (LinearLayout) view.findViewById(R.id.addMatch);

        // CONTENT OF CURRENT MATCH AND HIS CHILD
        final LinearLayout layout = (LinearLayout) mInflater.inflate(R.layout.current_match, null);
        TextView type = (TextView) layout.getChildAt(0);
        type.setText("Match " + typeMatch);

        LinearLayout scores = (LinearLayout) layout.getChildAt(1);
        LinearLayout teamsName = (LinearLayout) layout.getChildAt(2);
        LinearLayout buttonGoals = (LinearLayout) layout.getChildAt(3);
        final TextView titleMatchNext = (TextView) view.findViewById(R.id.titleMatchNext);
        final String titleMatchNextText;

        if(nextTeam != null){
            nextTeamHome = new JSONObject(nextTeam.get(0).toString());
            nextTeamAway = new JSONObject(nextTeam.get(1).toString());
            titleMatchNextText = "Match suivant " + nextTeamHome.getString("teamName") + " - " + nextTeamAway.getString("teamName");
        }else{
            titleMatchNextText = "";
        }

        // LOOP ON SCORES
        int countScore = scores.getChildCount();
        for (int i = 0; i < countScore; i++) {
            View v = scores.getChildAt(i);

            switch (v.getId()){
                case R.id.scoreTeamHome:
                    scoreTeamHome = (TextView) v;
                    break;

                case R.id.scoreTeamAway:
                    scoreTeamAway = (TextView) v;
                    break;
            }
        }

        // LOOP ON TEAMS NAMES
        int countTeam = teamsName.getChildCount();
        for (int i = 0; i < countTeam; i++) {
            View v = teamsName.getChildAt(i);

            switch (v.getId()){
                case R.id.teamHome:
                    teamHome = (TextView) v;
                    break;

                case R.id.teamAway:
                    teamAway = (TextView) v;
                    break;
            }
        }

        // LOOP ON BUTTON GOALS
        int countButton = teamsName.getChildCount();
        for (int i = 0; i < countButton; i++) {
            View v = buttonGoals.getChildAt(i);

            switch (v.getId()){
                case R.id.addButTeamHome:
                    goalHome = (Button) v;
                    goalHome.setBackgroundColor(Color.parseColor(homeTeam.getString("color")));
                    break;

                case R.id.addButTeamAway:
                    goalAway = (Button) v;
                    goalAway.setBackgroundColor(Color.parseColor(awayTeam.getString("color")));
                    break;
            }
        }

        // ADD GOAL FOR HOME TEAM
        if (goalHome != null) {
            goalHome.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    try { addGoal(currentMatch, "home"); }
                    catch (JSONException e) { e.printStackTrace();  }
                }
            });
        }

        // ADD GOAL FOR AWAY TEAM
        if (goalAway != null) {
            goalAway.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    try {  addGoal(currentMatch, "away");  }
                    catch (JSONException e) {   e.printStackTrace();  }
                }
            });
        }

        final TextView finalScoreTeamHome = scoreTeamHome;
        final TextView finalScoreTeamAway = scoreTeamAway;
        final TextView finalTeamHome = teamHome;
        final TextView finalTeamAway = teamAway;

        // RUN UI
        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                try {
                    final LinearLayout matchs = (LinearLayout) view.findViewById(R.id.addMatch);
                    //titleMatchNext.setText(titleMatchNextText);

                    finalScoreTeamHome.setText(currentMatch.getString("goalHomeTeam"));
                    finalScoreTeamHome.setTextColor(Color.parseColor(homeTeam.getString("color")));

                    finalScoreTeamAway.setText(currentMatch.getString("goalAwayTeam"));
                    finalScoreTeamAway.setTextColor(Color.parseColor(awayTeam.getString("color")));

                    finalTeamHome.setText(homeTeam.getString("teamName"));
                    finalTeamAway.setText(awayTeam.getString("teamName"));

                    // CREATE ANIMATIONS
                    final TranslateAnimation oldMatch = new TranslateAnimation(0, -(screenWidth), 0, 0);
                    final TranslateAnimation newMatch = new TranslateAnimation(screenWidth, 0, 0, 0);

                    // SET DURATIONS
                    oldMatch.setDuration(700);
                    newMatch.setDuration(400);

                    oldMatch.setAnimationListener(new Animation.AnimationListener() {
                        public void onAnimationStart(Animation animation) {
                        }

                        public void onAnimationRepeat(Animation animation) {
                        }

                        public void onAnimationEnd(Animation animation) {
                            matchs.removeAllViews();
                            content.addView(layout);
                            layout.startAnimation(newMatch);
                        }
                    });

                    if (matchs.getChildCount() > 0) matchs.startAnimation(oldMatch);
                    else content.addView(layout);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void addGoal(final JSONObject match, String homeOrAway) throws JSONException {
        final int goalHomeTeam;
        final int goalAwayTeam;
        String awayTeamId = match.getString("awayTeam");
        String homeTeamId = match.getString("homeTeam");
        final String goalTeam;
        final String otherTeam;

        if(homeOrAway.equals("home")){
            goalHomeTeam = match.getInt("goalHomeTeam") + 1;
            goalAwayTeam = match.getInt("goalAwayTeam");
            goalTeam = homeTeamId;
            otherTeam = awayTeamId;
        }
        else {
            goalAwayTeam = match.getInt("goalAwayTeam") + 1;
            goalHomeTeam = match.getInt("goalHomeTeam");
            goalTeam = awayTeamId;
            otherTeam = homeTeamId;
        }

        //

        // GET PLAYERS OF THE TEAM WHITCH GOAL
        api.getTeamPlayers(goalTeam, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET TEAM PLAYERS", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONArray playerData = new JSONArray(data);

                int nbPlayerData = playerData.length();
                ArrayList<JSONObject> players = new ArrayList();

                for(int i = 0; i < nbPlayerData; i++){
                    JSONObject player = new JSONObject(playerData.getString(i));
                    players.add(player);
                }

                // SHOW THE POPUP FOR THE SCORER
                showPopup(getActivity(), players, new Callback() {
                    public void onSuccess(Map<String, Object> values) throws JSONException {

                        //OPTIONS OF THE UPDATE OF THE MATCH
                        Map<String,Object> options = new HashMap<>();
                        options.put("idMatch", match.getString("_id"));
                        options.put("played", match.getString("played"));
                        options.put("goalHomeTeam", goalHomeTeam);
                        options.put("goalAwayTeam", goalAwayTeam);


                        // UPDATE THE MATCH
                        updateScoreMatch(options, new Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                currentMatch = (JSONObject) options.get("match");

                                // DRAW NEW SCORE
                                drawNewScore();
                            }
                        });

                        // UPDATE TEAM WITCH GOAL
                        getTeam(goalTeam, new Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                updateScoreTeam(options, true);
                            }
                        });

                        // UPDATE TEAM WITCH NOT GOAL
                        getTeam(otherTeam, new Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                updateScoreTeam(options, false);
                            }
                        });
                    }
                });
            }
        });
    }

    private void showPopup(final Activity context, final ArrayList<JSONObject> players, final Callback cb) throws JSONException {

        // CREATE POPUP
        popup = new PopupWindow(context);

        final LinearLayout viewGroup = (LinearLayout) mInflater.inflate(R.layout.add_scorer, null);
        LinearLayout scorers = (LinearLayout) viewGroup.findViewById(R.id.scorers);
        Button cancel = (Button) viewGroup.findViewById(R.id.cancel_scorer);

        int nbPlayers = players.size();

        // PLAYERS OF THE TEAM WITCH GOAL
        for(int i = 0; i < nbPlayers; i++){

            // DRAW THE PLAYER
            final JSONObject player = players.get(i);
            final Button scorer = (Button) mInflater.inflate(R.layout.add_button_scorer, null);

            LinearLayout.LayoutParams inputPlayerParams = new  LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            inputPlayerParams.setMargins(0, 0, 0, 20);
            scorer.setLayoutParams(inputPlayerParams);

            scorer.setText(player.getString("playerName"));
            scorers.addView(scorer);

            // BUILD OPTIONS
            final Map<String, Object> options = new HashMap<String, Object>();
            options.put("idPlayer", player.getString("_id"));
            options.put("playerName", player.getString("playerName"));
            options.put("nbGoal", player.getInt("nbGoal") + 1);

            // EVENT ON BUTTON TO KNOW WHO GOAL
            scorer.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {

                    // UPDATE PLAYER
                    updatePlayer(options, new Callback() {
                        public void onSuccess(Map<String, Object> options) throws JSONException {
                            cb.onSuccess(new HashMap<String, Object>());
                        }
                    });
                }
            });
        }

        // CANCEL THE GOAL
        cancel.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                popup.dismiss();
            }
        });

        // RUN UI
        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                popup.setContentView(viewGroup);
                popup.setWidth(screenWidth);
                popup.setHeight(screenHeight);
                popup.setFocusable(true);
                popup.showAtLocation(viewGroup, Gravity.NO_GRAVITY, 0, 0);
            }
        });
    }

    private void updatePlayer(Map<String, Object> options, final Callback cb ) {
        api.updatePlayer(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("UPDATE PLAYER", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                Log.d("UPDATE PLAYER", data);
                cb.onSuccess(new HashMap<String, Object>());

                // RUN UI
                getActivity().runOnUiThread(new Runnable() {
                    public void run() {
                        popup.dismiss();
                    }
                });
            }
        });
    }

    private void getTeam(String goalTeam, final Callback cb) {
        api.getTeam(goalTeam, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET TEAM", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject team = new JSONObject(data);
                Map<String, Object> myTeam = new HashMap<String, Object>();
                myTeam.put("team", team);
                cb.onSuccess(myTeam);
            }
        });
    }

    private void updateScoreTeam(Map<String, Object> teamOptions, Boolean goal) throws JSONException {
        JSONObject team = (JSONObject) teamOptions.get("team");

        int goalFor;
        int goalAgainst;
        int difference;

        if(goal){
            goalFor = team.getInt("gf") + 1;
            goalAgainst = team.getInt("ga");
        }else{
            goalFor = team.getInt("gf");
            goalAgainst = team.getInt("ga") + 1;
        }

        difference = goalFor - goalAgainst;

        Map<String, Object> options = new HashMap<String, Object>();
        options.put("played", team.getInt("played"));
        options.put("idTeam", team.getString("_id"));
        options.put("teamName", team.getString("teamName"));
        options.put("won", team.getInt("won"));
        options.put("lost", team.getInt("lost"));
        options.put("drawn", team.getInt("drawn"));
        options.put("gf", goalFor);
        options.put("ga", goalAgainst);
        options.put("gd", difference);
        options.put("pts", team.getInt("pts"));

        api.updateTeam(options, new Api.ApiCallback() {
            public void onFailure(String error) { Log.d("UPDATE TEAM", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                Log.d("SCORE TEAM UPDATED", data);
            }
        });
    }

    private void updateScoreMatch(Map<String, Object> options, final Callback cb) {
        api.updateMatch(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("UPDATE MATCH", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject match = new JSONObject(data);

                Map<String, Object> options = new HashMap<String, Object>();
                options.put("match", match);
                cb.onSuccess(options);
            }
        });
    }

    private void drawNewScore() throws JSONException {

        // SCORES VIEW
        final TextView scoreTeamHome = (TextView) view.findViewById(R.id.scoreTeamHome);
        final TextView scoreTeamAway = (TextView) view.findViewById(R.id.scoreTeamAway);
        final LinearLayout match = (LinearLayout) view.findViewById(R.id.currentMatch);

        // SET ANIMATION
        final Animation shake = AnimationUtils.loadAnimation(getActivity(), R.anim.shake);

        // RUN UI
        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                try {
                    match.startAnimation(shake);
                    scoreTeamAway.setText(currentMatch.getString("goalAwayTeam"));
                    scoreTeamHome.setText(currentMatch.getString("goalHomeTeam"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
