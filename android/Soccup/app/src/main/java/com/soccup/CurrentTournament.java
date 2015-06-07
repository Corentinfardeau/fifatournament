package com.soccup;

import android.app.Activity;
import android.graphics.Point;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
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
        Button btnMatchNext = (Button) findViewById(R.id.btnMatchNext);

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
                Log.d("data", data);

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

                                played = false;

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
                if(played == true){
                    idCurrentMatch = null;
                }

                if(checkMatchsPlayed()) {
                    Log.d("FIN", "FIN DU TOURNOI");
                }
            }
        });
    }

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

        if(nbPlayed == (nbMatchs * 2 - 1)) return true;
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
                showMatch(currentMatch);
            }
        });
    }

    private void showMatch(final JSONObject currentMatch){
        final TextView test = (TextView) findViewById(R.id.titleMatchNext);

        // RUN UI
        runOnUiThread(new Runnable() {
            public void run() {
                try {
                    test.setText(currentMatch.getString("awayTeam") + " contre " + currentMatch.getString("homeTeam"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
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
