package com.soccup.fragments;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Point;
import android.os.Bundle;
import android.support.v4.app.Fragment;
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

import com.soccup.activities.CurrentTournamentActivity;
import com.soccup.R;
import com.soccup.activities.Victory;
import com.soccup.models.League;
import com.soccup.models.Match;
import com.soccup.models.Player;
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

public class CurrentMatchFragment extends Fragment {
    private static final String ARG_POSITION = "position";
    private int position;
    private String tournament;
    private String idLeague;
    private JSONObject currentMatch;
    private Button btnMatchNext;

    // MODELS
    private League currentLeague = new League();
    private Match matchObject = new Match();
    private Team objectTeam = new Team();
    private Player objectPlayer = new Player();

    // SCREEN SPECS
    private int screenWidth;
    private int screenHeight;
    private PopupWindow popup;

    // VIEWS
    private View view;
    private LayoutInflater mInflater;

    // KNOW IF THE MATCH WAS SET A FIRST TIME
    private Boolean setDrawn = false;

    // SCORES LIVE
    private Map<String, Object> scoreHome = new HashMap<>();
    private Map<String, Object> scoreAway = new HashMap<>();

    // ON CREATE
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        position = getArguments().getInt(ARG_POSITION);
    }

    // ON CREATE VIEW
    public View onCreateView(LayoutInflater inflater,ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_current_match, container, false);
        mInflater = inflater;
        btnMatchNext = (Button) view.findViewById(R.id.btnMatchNext);

        // GET THE EXTRAS
        CurrentTournamentActivity activity = (CurrentTournamentActivity) getActivity();
        Bundle extras = activity.getExtras();

        // GET SCREEN WIDTH AND HEIGHT
        Display display = getActivity().getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        screenWidth = size.x;
        screenHeight = size.y;

        if (extras != null) {

            // GET DATA SEND BY THE LAST ACTIVITY
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {

                // GET THE LEAGUE
                currentLeague.getLeague(idLeague, new League.Callback() {
                    public void onSuccess(Map<String, Object> options) throws JSONException {

                        // CREATE A NEW MATCH
                        currentLeague.newMatch(new League.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                JSONObject theMatch = (JSONObject) options.get("match");
                                currentMatch = theMatch;

                                // SHOW THE MATCH
                                showNewMatch(theMatch, "aller");
                            }
                        });
                    }
                });

            } catch (JSONException e) {   e.printStackTrace();  }
        }

        // CREATE A NEW MATCH OR SET THE END OF THE TOURNAMENT
        btnMatchNext.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                try {

                    // IF A MATCH STILL TO PLAY, WE LAUNCH IT
                    if(currentLeague.checkMatchsPlayed() > 1) {

                        // BUILD OPTIONS TO UPDATE THE CURRENT MATCH
                        final Map<String, Object> optionsMatch = new HashMap<String, Object>();
                        optionsMatch.put("idMatch", currentMatch.getString("_id"));
                        optionsMatch.put("played", true);
                        optionsMatch.put("goalAwayTeam", currentMatch.getInt("goalAwayTeam"));
                        optionsMatch.put("goalHomeTeam", currentMatch.getInt("goalHomeTeam"));

                        // UPDATE THE CURRENT MATCH
                        matchObject.updateMatch(optionsMatch, new Match.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                final JSONObject match = (JSONObject)options.get("match");

                                // AND THEN LAUNCH A NEW MATCH
                                currentLeague.getLeague(idLeague, new League.Callback() {
                                    public void onSuccess(Map<String, Object> options) throws JSONException {
                                        setDrawn = false;

                                        // NEW MATCH
                                        currentLeague.newMatch(new League.Callback() {
                                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                                JSONObject theMatch = (JSONObject) options.get("match");
                                                String typeMatch = (String) options.get("type");
                                                currentMatch = theMatch;

                                                // SHOW THE MATCH
                                                showNewMatch(theMatch, typeMatch);
                                            }
                                        });
                                    }
                                });
                            }
                        });

                    }

                    // END OF THE TOURNAMENT, LAUNCH THE NEXT ACTIVITY
                    else{ tournamentFinished(); }

                } catch (JSONException e) {  e.printStackTrace();  }
            }
        });

        return view;
    }

    private void showNewMatch(final JSONObject match, String typeMatch) throws JSONException {

        // BUILD THE TWO TEAMS
        final JSONObject homeTeam = (JSONObject) match.get("homeTeam");
        final JSONObject awayTeam = (JSONObject) match.get("awayTeam");

        // FIRST UPDATE OF THE SCORE OF THE TEAMS
        if(setDrawn == false){

            // LIVE SCORE UPDATE: BEGIN OF THE MATCH = DRAWN
            scoreHome.put("won", 0); scoreHome.put("drawn", 1);  scoreHome.put("lost", 0); scoreHome.put("pts", 1); scoreHome.put("played", 1); scoreHome.put("gf", 0); scoreHome.put("ga", 0);
            scoreAway.put("won", 0); scoreAway.put("drawn", 1);  scoreAway.put("lost", 0); scoreAway.put("pts", 1); scoreAway.put("played", 1); scoreAway.put("gf", 0); scoreAway.put("ga", 0);

            Map<String, Object> optionsTeamHome = new HashMap<>();
            optionsTeamHome.put("team", homeTeam);
            updateScoreTeam(optionsTeamHome, scoreHome);

            Map<String, Object> optionsTeamAway = new HashMap<>();
            optionsTeamAway.put("team", awayTeam);
            updateScoreTeam(optionsTeamAway, scoreAway);

            setDrawn = true;
        }

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

        // LOOP ON SCORES COMPONENTS
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

        // LOOP ON TEAMS NAMES COMPONENTS
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

        // LOOP ON BUTTON GOALS COMPONENTS
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
                    try { addGoal(match, "home"); }
                    catch (JSONException e) { e.printStackTrace();  }
                }
            });
        }

        // ADD GOAL FOR AWAY TEAM
        if (goalAway != null) {
            goalAway.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    try {  addGoal(match, "away");  }
                    catch (JSONException e) {   e.printStackTrace();  }
                }
            });
        }

        final TextView finalScoreTeamHome = scoreTeamHome;
        final TextView finalScoreTeamAway = scoreTeamAway;
        final TextView finalTeamHome = teamHome;
        final TextView finalTeamAway = teamAway;

        // RUN UI ON MAIN THREAD
        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                try {
                    if(currentLeague.checkMatchsPlayed() == 1){ btnMatchNext.setText("TERMINER");}

                    final LinearLayout matchs = (LinearLayout) view.findViewById(R.id.addMatch);

                    finalScoreTeamHome.setText(match.getString("goalHomeTeam"));
                    finalScoreTeamHome.setTextColor(Color.parseColor(homeTeam.getString("color")));

                    finalScoreTeamAway.setText(match.getString("goalAwayTeam"));
                    finalScoreTeamAway.setTextColor(Color.parseColor(awayTeam.getString("color")));

                    finalTeamHome.setText(homeTeam.getString("teamName"));
                    finalTeamAway.setText(awayTeam.getString("teamName"));

                    // CREATE ANIMATIONS
                    final TranslateAnimation oldMatch = new TranslateAnimation(0, -(screenWidth), 0, 0);
                    final TranslateAnimation newMatch = new TranslateAnimation(screenWidth, 0, 0, 0);

                    // SET DURATIONS OF ANIMATIONS
                    oldMatch.setDuration(700);
                    newMatch.setDuration(400);

                    oldMatch.setAnimationListener(new Animation.AnimationListener() {
                        public void onAnimationStart(Animation animation) { }
                        public void onAnimationRepeat(Animation animation) { }

                        public void onAnimationEnd(Animation animation) {
                            matchs.removeAllViews();
                            content.addView(layout);
                            layout.startAnimation(newMatch);
                        }
                    });

                    if (matchs.getChildCount() > 0) matchs.startAnimation(oldMatch);
                    else content.addView(layout);

                } catch (JSONException e) { e.printStackTrace(); }
            }
        });
    }

    private void tournamentFinished() {
        Intent intent = new Intent(getActivity(), Victory.class);

        // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
        intent.putExtra("TOURNAMENT", tournament);
        intent.putExtra("LEAGUE", idLeague);

        startActivity(intent);
        //overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
    }

    private void addGoal(final JSONObject match, String homeOrAway) throws JSONException {
        final int goalHomeTeam;
        final int goalAwayTeam;

        JSONObject awayTeam = (JSONObject) match.get("awayTeam");
        JSONObject homeTeam = (JSONObject) match.get("homeTeam");

        final Map<String, Object> newScoreHome = new HashMap<>();
        final Map<String, Object> newScoreAway = new HashMap<>();

        String awayTeamId = awayTeam.getString("_id");
        final String homeTeamId = homeTeam.getString("_id");

        final String goalTeam;
        final String otherTeam;

        // GOAL BY HOME TEAM
        if(homeOrAway.equals("home")){
            goalHomeTeam = match.getInt("goalHomeTeam") + 1;
            goalAwayTeam = match.getInt("goalAwayTeam");

            newScoreHome.put("gf", 1);
            newScoreAway.put("gf", 0);
            newScoreHome.put("ga", 0);
            newScoreAway.put("ga", 1);

            goalTeam = homeTeamId;
            otherTeam = awayTeamId;
        }

        // GOAL BY AWAY TEAM
        else {
            goalAwayTeam = match.getInt("goalAwayTeam") + 1;
            goalHomeTeam = match.getInt("goalHomeTeam");
            goalTeam = awayTeamId;
            otherTeam = homeTeamId;

            newScoreHome.put("gf", 0);
            newScoreAway.put("gf", 1);
            newScoreHome.put("ga", 1);
            newScoreAway.put("ga", 0);
        }

        // COMPARE SCORE OF THE TEAMS TO UPDATE IT
        if(goalAwayTeam < goalHomeTeam){

            // NEW SCORE TEAM HOME
            if((int)scoreHome.get("won") == 0) newScoreHome.put("won", 1); else newScoreHome.put("won", 0);
            if((int)scoreHome.get("lost") == 0) newScoreHome.put("lost", 0); else newScoreHome.put("lost", -1);
            if((int)scoreHome.get("drawn") == 0) newScoreHome.put("drawn", 0); else newScoreHome.put("drawn", -1);
            if((int)scoreHome.get("pts") == 3) newScoreHome.put("pts", 0); else if((int)scoreHome.get("pts") == 1) newScoreHome.put("pts", 2); else newScoreHome.put("pts", 3);

            // NEW SCORE TEAM AWAY
            if((int)scoreAway.get("won") == 0) newScoreAway.put("won", 0); else newScoreAway.put("won", -1);
            if((int)scoreAway.get("lost") == 0) newScoreAway.put("lost", 1); else newScoreAway.put("lost", 0);
            if((int)scoreAway.get("drawn") == 0) newScoreAway.put("drawn", 0); else newScoreAway.put("drawn", -1);
            if((int)scoreAway.get("pts") == 3) newScoreAway.put("pts", -3); else if((int)scoreAway.get("pts") == 1) newScoreAway.put("pts", -1); else newScoreAway.put("pts", 0);

            scoreHome.put("won", 1); scoreHome.put("lost", 0); scoreHome.put("drawn", 0); scoreHome.put("pts", 3);
            scoreAway.put("won", 0); scoreAway.put("drawn", 0);  scoreAway.put("lost", 1); scoreAway.put("pts", 0);
        }

        else if(goalAwayTeam > goalHomeTeam){

            // NEW SCORE TEAM HOME
            if((int)scoreAway.get("won") == 0) newScoreAway.put("won", 1); else newScoreAway.put("won", 0);
            if((int)scoreAway.get("lost") == 0) newScoreAway.put("lost", 0); else newScoreAway.put("lost", -1);
            if((int)scoreAway.get("drawn") == 0) newScoreAway.put("drawn", 0); else newScoreAway.put("drawn", -1);
            if((int)scoreAway.get("pts") == 3) newScoreAway.put("pts", 0); else if((int)scoreAway.get("pts") == 1) newScoreAway.put("pts", 2); else newScoreAway.put("pts", 3);

            // NEW SCORE TEAM AWAY
            if((int)scoreHome.get("won") == 0) newScoreHome.put("won", 0); else newScoreHome.put("won", -1);
            if((int)scoreHome.get("lost") == 0) newScoreHome.put("lost", 1); else newScoreHome.put("lost", 0);
            if((int)scoreHome.get("drawn") == 0) newScoreHome.put("drawn", 0); else newScoreHome.put("drawn", -1);
            if((int)scoreHome.get("pts") == 3) newScoreHome.put("pts", -3); else if((int)scoreHome.get("pts") == 1) newScoreHome.put("pts", -1); else newScoreHome.put("pts", 0);

            scoreHome.put("won", 0); scoreHome.put("lost", 1); scoreHome.put("drawn", 0); scoreHome.put("pts", 0);
            scoreAway.put("won", 1); scoreAway.put("drawn", 0);  scoreAway.put("lost", 0); scoreAway.put("pts", 3);
        }

        else{

            // NEW SCORE TEAM AWAY
            if((int)scoreAway.get("won") == 0) newScoreAway.put("won", 0); else newScoreAway.put("won", -1);
            if((int)scoreAway.get("lost") == 0) newScoreAway.put("lost", 0); else newScoreAway.put("lost", -1);
            if((int)scoreAway.get("drawn") == 0) newScoreAway.put("drawn", 1); else newScoreAway.put("drawn", 0);
            if((int)scoreAway.get("pts") == 3) newScoreAway.put("pts", -2); else if((int)scoreAway.get("pts") == 1) newScoreAway.put("pts", 0); else newScoreAway.put("pts", 1);

            // NEW SCORE TEAM HOME
            if((int)scoreHome.get("won") == 0) newScoreHome.put("won", 0); else newScoreHome.put("won", -1);
            if((int)scoreHome.get("lost") == 0) newScoreHome.put("lost", 0); else newScoreHome.put("lost", -1);
            if((int)scoreHome.get("drawn") == 0) newScoreHome.put("drawn", 1); else newScoreHome.put("drawn", 0);
            if((int)scoreHome.get("pts") == 3) newScoreHome.put("pts", -2); else if((int)scoreHome.get("pts") == 1) newScoreHome.put("pts", 0); else newScoreHome.put("pts", 1);

            scoreHome.put("won", 0); scoreHome.put("lost", 0); scoreHome.put("drawn", 1); scoreHome.put("pts", 1);
            scoreAway.put("won", 0); scoreAway.put("drawn", 1);  scoreAway.put("lost", 0); scoreAway.put("pts", 1);
        }

        newScoreAway.put("played", 0);
        newScoreHome.put("played", 0);


        // GET PLAYERS OF THE TEAM WITCH GOAL
        objectTeam.getTeamPlayers(goalTeam, new Team.Callback() {
            public void onSuccess(Map<String, Object> options) throws JSONException {
                JSONArray playerData = (JSONArray) options.get("players");

                int nbPlayerData = playerData.length();
                ArrayList<JSONObject> players = new ArrayList();

                for (int i = 0; i < nbPlayerData; i++) {
                    JSONObject player = new JSONObject(playerData.getString(i));
                    players.add(player);
                }

                // SHOW THE POPUP FOR THE SCORER
                showPopup(getActivity(), players, new Callback() {
                    public void onSuccess(Map<String, Object> values) throws JSONException {

                        //OPTIONS OF THE UPDATE OF THE MATCH
                        Map<String, Object> options = new HashMap<>();
                        options.put("idMatch", match.getString("_id"));
                        options.put("played", match.getString("played"));
                        options.put("goalHomeTeam", goalHomeTeam);
                        options.put("goalAwayTeam", goalAwayTeam);


                        // UPDATE THE MATCH
                        matchObject.updateMatch(options, new Match.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                currentMatch = (JSONObject) options.get("match");

                                // DRAW NEW SCORE
                                drawNewScore();
                            }
                        });

                        // UPDATE TEAM WITCH GOAL
                        objectTeam.getTeam(goalTeam, new Team.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                Map<String, Object> newScoreTeam;
                                if(goalTeam == homeTeamId) newScoreTeam = newScoreHome;
                                else newScoreTeam = newScoreAway;

                                // UPDATE THAT TEAM
                                updateScoreTeam(options, newScoreTeam);
                            }
                        });

                        // UPDATE TEAM WITCH NOT GOAL
                        objectTeam.getTeam(otherTeam, new Team.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                Map<String, Object> newScoreTeam;
                                if(otherTeam == homeTeamId) newScoreTeam = newScoreHome;
                                else newScoreTeam = newScoreAway;

                                // UPDATE THAT TEAM
                                updateScoreTeam(options, newScoreTeam);
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

        // COMPONENTS
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

            // BUILD OPTIONS TO UPDATE A PLAYER
            final Map<String, Object> options = new HashMap<String, Object>();
            options.put("idPlayer", player.getString("_id"));
            options.put("playerName", player.getString("playerName"));
            options.put("nbGoal", player.getInt("nbGoal") + 1);

            // EVENT ON BUTTON TO KNOW WHO GOAL
            scorer.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {

                    // UPDATE PLAYER
                    objectPlayer.updatePlayer(options, new Player.Callback() {
                        public void onSuccess(Map<String, Object> options) throws JSONException {

                            // CLOSE THE POPUP
                            getActivity().runOnUiThread(new Runnable() {
                                public void run() {
                                    popup.dismiss();
                                }
                            });

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

        // SHOW THE POPUP
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

    private void updateScoreTeam(Map<String, Object> teamData, Map<String, Object> newScoreTeam) throws JSONException {
        JSONObject team = (JSONObject) teamData.get("team");
        int difference;
        difference = (team.getInt("gf") + (int)newScoreTeam.get("gf")) - (team.getInt("ga") + (int)newScoreTeam.get("ga"));

        // BUILD OPTIONS TO UPDATE THE TEAM
        Map<String, Object> options = new HashMap<String, Object>();
        options.put("played", team.getInt("played") + (int)newScoreTeam.get("played"));
        options.put("idTeam", team.getString("_id"));
        options.put("teamName", team.getString("teamName"));
        options.put("won", team.getInt("won") + (int)newScoreTeam.get("won"));
        options.put("lost", team.getInt("lost") + (int)newScoreTeam.get("lost"));
        options.put("drawn", (team.getInt("drawn") + ((int)newScoreTeam.get("drawn"))));
        options.put("gf", team.getInt("gf") + (int)newScoreTeam.get("gf"));
        options.put("ga", team.getInt("ga") + (int)newScoreTeam.get("ga"));
        options.put("gd", difference);
        options.put("pts", team.getInt("pts") + (int)newScoreTeam.get("pts"));

        // UPDATE THE TEAM
        objectTeam.updateTeam(options, new Team.Callback() {
            public void onSuccess(Map<String, Object> options) throws JSONException { }
        });
    }

    private void drawNewScore() throws JSONException {

        // SCORES COMPONENTS
        final TextView scoreTeamHome = (TextView) view.findViewById(R.id.scoreTeamHome);
        final TextView scoreTeamAway = (TextView) view.findViewById(R.id.scoreTeamAway);
        final LinearLayout match = (LinearLayout) view.findViewById(R.id.currentMatch);

        // SET ANIMATION
        final Animation shake = AnimationUtils.loadAnimation(getActivity(), R.anim.shake);

        // RUN UI ON MAIN THREAD
        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                try {
                    match.startAnimation(shake);
                    scoreTeamAway.setText(currentMatch.getString("goalAwayTeam"));
                    scoreTeamHome.setText(currentMatch.getString("goalHomeTeam"));
                } catch (JSONException e) {  e.printStackTrace(); }
            }
        });
    }

    // INSTANCE
    public static Fragment newInstance(int index) {
        CurrentMatchFragment f = new CurrentMatchFragment();
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
