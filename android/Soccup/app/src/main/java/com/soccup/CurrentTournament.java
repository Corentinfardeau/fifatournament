package com.soccup;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Point;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.widget.Button;
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


public class CurrentTournament extends Activity {
    private Point p;
    private String tournament;
    private String idTournament;
    private String idLeague;
    private String idCurrentMatch;
    private JSONArray firstLeg;
    private JSONArray returnLeg;
    private Api api = new Api();
    private JSONObject currentMatch;
    private Button btnMatchNext;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.current_tournament);

        //change view onglet
/*
        //Button "add but team"
        Button btnAddButHome = (Button)findViewById(R.id.addButTeamHome);
        Button btnAddButAway = (Button)findViewById(R.id.addButTeamAway);

        //Click team Home
        btnAddButHome.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                //Open popup window
                if (p != null)
                    showPopup(CurrentTournament.this, p);
            }
        });

        //Click team away
        btnAddButAway.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                //Open popup window
                if (p != null)
                    showPopup(CurrentTournament.this, p);
            }
        });*/

        Bundle extras = getIntent().getExtras();
        btnMatchNext = (Button) findViewById(R.id.btnMatchNext);

        // EVENT ON BTNMATCHNEXT
        btnMatchNext.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(idCurrentMatch != null) {
                    Map<String, Object> options = new HashMap<String, Object>();
                        options.put("idMatch", idCurrentMatch);

                    try {
                        options.put("played", true);
                        options.put("goalAwayTeam", currentMatch.getInt("goalAwayTeam"));
                        options.put("goalHomeTeam", currentMatch.getInt("goalHomeTeam"));
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }

                    // UPDATE MATCH
                    updateMatch(options);

                }
            }
        });

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                JSONObject dataTournament = new JSONObject(tournament);
                idTournament = dataTournament.getString("_id");

                // GET THE LEAGUE
                getLeague(idLeague);

            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    /*
    //Initialize origin popup
    public void onWindowFocusChanged(boolean hasFocus) {

        int[] location = new int[2];
        LinearLayout box = (LinearLayout) findViewById(R.id.currentMatch);

        // Get the x, y location and store it in the location[] array
        // location[0] = x, location[1] = y.
        box.getLocationOnScreen(location);

        //Initialize the Point with x, and y positions
        p = new Point();
        p.x = location[0];
        p.y = location[1];
    }*/

    private void updateMatch(Map<String, Object> options) {
        api.updateMatch(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("UPDATE MATCH", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject dataMatch = new JSONObject(data);

                // NB MATCHS BY TURN
                int nbMatchs = firstLeg.length();
                Boolean played = true;

                // RESEARCH IN FIRSTLEG MATCHS
                for (int i = 0; i < nbMatchs; i++) {

                    try {

                        // UPDATE THE MATCH IN THE TABLE
                        JSONObject match = new JSONObject(firstLeg.getString(i));
                        if(match.getString("_id").equals(dataMatch.getString("_id"))){
                            match.put("played", true);
                            firstLeg.put(i, match);
                        }

                        // NEW MATCH
                        if (match.getBoolean("played") == false){

                            // MATCH BECOME THE CURRENT MATCH
                            currentMatch = match;
                            idCurrentMatch = match.getString("_id");

                            played = false;

                            // GET THE MATCH
                            getMatch(idCurrentMatch);

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
                            if(match.getString("_id").equals(dataMatch.getString("_id"))){
                                match.put("played", true);
                                returnLeg.put(i, match);
                            }

                            // NEW MATCH
                            if (match.getBoolean("played") == false) {

                                // MATCH BECOME THE CURRENT MATCH
                                currentMatch = match;
                                idCurrentMatch = match.getString("_id");

                                // GET THE MATCH
                                getMatch(idCurrentMatch);

                                break;
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }

                // NO MORE MATCH TO PLAY
                // TOURNAMENT CLOSE
                if(checkMatchsPlayed()) {
                    idCurrentMatch = null;

                    // TOURNAMENT FINISHED
                    tournamentFinished();

                }
            }
        });
    }

    private void tournamentFinished() {
        
        btnMatchNext.setText("TERMINER");

        btnMatchNext.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(CurrentTournament.this, Victory.class);

                // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
                intent.putExtra("TOURNAMENT", tournament);
                intent.putExtra("LEAGUE", idLeague);

                startActivity(intent);
                overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
            }
        });
    }

    // CHECK IF ALL MATCHS ARE PLAYED
    private Boolean checkMatchsPlayed() throws JSONException {
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

        if(nbPlayed == (nbMatchs * 2)) return true;
        else return false;
    }

    public void getLeague(String idLeague){
        api.getLeague(idLeague, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET A LEAGUE", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject dataLeague = new JSONObject(data);

                // RETURN AND FIRST LEG
                firstLeg = dataLeague.getJSONArray("firstLeg");
                returnLeg = dataLeague.getJSONArray("returnLeg");

                // THE FIRST MATCH
                JSONObject match = new JSONObject(firstLeg.getString(0));
                idCurrentMatch = match.getString("_id");

                // GET THE MATCH
                getMatch(idCurrentMatch);
            }
        });
    }

    private void getMatch(String idCurrentMatch) {
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

                            if (finalI == 1) {
                                showMatch(currentMatch, teams);
                            }
                        }
                    });
                }
            }
        });
    }

    private void showMatch(final JSONObject currentMatch, final ArrayList teams) throws JSONException {

        // BUILD TEAMS
        final JSONObject homeTeam = new JSONObject(teams.get(0).toString());
        final JSONObject awayTeam = new JSONObject(teams.get(1).toString());

        // VALUE TO SET
        TextView scoreTeamHome = null;
        TextView scoreTeamAway = null;
        TextView teamHome = null;
        TextView teamAway = null;
        Button goalHome = null;
        Button goalAway = null;

        // CONTENT OF THE CURRENT TOURNAMENT
        final LinearLayout content = (LinearLayout) findViewById(R.id.addMatch);

        // CONTENT OF CURRENT MATCH AND HIS CHILD
        final LinearLayout layout = (LinearLayout) getLayoutInflater().inflate(R.layout.current_match, null);
        TextView firstLeg = (TextView) layout.getChildAt(0);
        LinearLayout scores = (LinearLayout) layout.getChildAt(1);
        LinearLayout teamsName = (LinearLayout) layout.getChildAt(2);
        LinearLayout buttonGoals = (LinearLayout) layout.getChildAt(3);

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
                break;

                case R.id.addButTeamAway:
                    goalAway = (Button) v;
                break;
            }
        }

        // ADD GOAL FOR HOME TEAM
        if (goalHome != null) {
            goalHome.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    try {
                        addGoal(currentMatch, "home");
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        // ADD GOAL FOR AWAY TEAM
        if (goalAway != null) {
            goalAway.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    try {
                        addGoal(currentMatch, "away");
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        final TextView finalScoreTeamHome = scoreTeamHome;
        final TextView finalScoreTeamAway = scoreTeamAway;
        final TextView finalTeamHome = teamHome;
        final TextView finalTeamAway = teamAway;

        // RUN UI
        runOnUiThread(new Runnable() {
            public void run() {
                try {
                    finalScoreTeamHome.setText(currentMatch.getString("goalHomeTeam"));
                    finalScoreTeamAway.setText(currentMatch.getString("goalAwayTeam"));
                    finalTeamHome.setText(homeTeam.getString("teamName"));
                    finalTeamAway.setText(awayTeam.getString("teamName"));
                    final LinearLayout matchs = (LinearLayout) findViewById(R.id.addMatch);

                    // GET SCREEN WIDTH
                    Display display = getWindowManager().getDefaultDisplay();
                    Point size = new Point();
                    display.getSize(size);
                    int width = size.x;

                    // CREATE ANIMATIONS
                    final TranslateAnimation oldMatch = new TranslateAnimation(0,-(width),0,0);
                    final TranslateAnimation newMatch = new TranslateAnimation(width,0,0,0);

                    // SET DURATIONS
                    oldMatch.setDuration(700);
                    newMatch.setDuration(400);

                    oldMatch.setAnimationListener(new Animation.AnimationListener() {

                        public void onAnimationStart(Animation animation) {}

                        public void onAnimationRepeat(Animation animation) {}

                        public void onAnimationEnd(Animation animation) {
                            matchs.removeAllViews();
                            content.addView(layout);
                            layout.startAnimation(newMatch);
                        }
                    });

                    if(matchs.getChildCount() > 0) matchs.startAnimation(oldMatch);
                    else content.addView(layout);
                }
                catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void addGoal(JSONObject currentmatch, String homeOrAway) throws JSONException {
        int goalHomeTeam;
        int goalAwayTeam;

        if(homeOrAway.equals("home")){ goalHomeTeam = currentmatch.getInt("goalHomeTeam") + 1; goalAwayTeam = currentmatch.getInt("goalAwayTeam"); }
        else { goalAwayTeam = currentmatch.getInt("goalAwayTeam") + 1; goalHomeTeam = currentmatch.getInt("goalHomeTeam"); }

        Map<String,Object> options = new HashMap<>();
            options.put("idMatch", currentmatch.getString("_id"));
            options.put("played", currentmatch.getString("played"));
            options.put("goalHomeTeam", goalHomeTeam);
            options.put("goalAwayTeam", goalAwayTeam);

        // UPDATE THE MATCH
        api.updateMatch(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("UPDATE MATCH", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                Log.d("data", data);
            }
        });
    }

    // The method that displays the popup.
    /*private void showPopup(final Activity context, Point p) {

        // Inflate the popup_layout.xml
        LinearLayout viewGroup = (LinearLayout) context.findViewById(R.id.popupAddScorer);
        LayoutInflater layoutInflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View layout = layoutInflater.inflate(R.layout.add_scorer, viewGroup);

        // Creating the PopupWindow
        final PopupWindow popup = new PopupWindow(context);
        popup.setContentView(layout);
        popup.setWidth(900);
        popup.setHeight(800);
        popup.setFocusable(true);

        // Some offset to align the popup a bit to the right, and a bit down, relative to button's position.
        int OFFSET_X = 20;
        int OFFSET_Y = 20;

        // Displaying the popup at the specified location, + offsets.
        popup.showAtLocation(layout, Gravity.NO_GRAVITY, p.x + OFFSET_X, p.y + OFFSET_Y);

        // Getting a reference to Close button, and close the popup when clicked.
        Button close = (Button) layout.findViewById(R.id.cancel_scorer);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d("test", "test");
                popup.dismiss();
            }
        });
    }*/

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        super.onCreateOptionsMenu(menu);
        getMenuInflater().inflate(R.menu.menu_current_match, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.

        switch (item.getItemId()) {
            case R.id.ongletCurrent:
                // Comportement du bouton "Aide"
                return true;
            case R.id.ongletAll:
                // Comportement du bouton "Rafraichir"
                return true;
            case R.id.ongletClassement:
                // Comportement du bouton "Recherche"
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
