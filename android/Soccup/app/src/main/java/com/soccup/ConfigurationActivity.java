package com.soccup;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.TextView;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public class ConfigurationActivity extends AppCompatActivity {
    private Boolean randomTeam = false;
    private Api api = new Api();
    private String tournament;
    private String idTournament;
    private String idLeague;
    private JSONArray teams;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_configuration);

        ActionBar actionBar = getSupportActionBar();
        //actionBar.setBackgroundDrawable(getResources().getDrawable(R.drawable.rounded_corner_btn));

        // COMPONENTS
        Button createTournament = (Button) findViewById(R.id.btnBegin);
        Button minusNbPlayers = (Button) findViewById(R.id.minusPlayer);
        Button moreNbPlayers = (Button) findViewById(R.id.morePlayer);
        Button minusNbPlayersByTeam = (Button) findViewById(R.id.minusPlayerByTeam);
        Button moreNbPlayersByTeam = (Button) findViewById(R.id.morePlayerByTeam);
        Switch teamAlea = (Switch) findViewById(R.id.teamAlea);
        final TextView nbPlayers = (TextView) findViewById(R.id.nbPlayersNumber);
        final TextView nbPlayersByTeam = (TextView) findViewById(R.id.nbPlayersByTeamNumber);

        // NB PLAYERS EVENTS
        minusNbPlayers.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(Integer.parseInt(nbPlayers.getText().toString()) > 2){
                    int newNbPlayers = Integer.parseInt(nbPlayers.getText().toString()) - 1;
                    if(newNbPlayers > Integer.parseInt(nbPlayersByTeam.getText().toString())) {
                        nbPlayers.setText(Integer.toString(newNbPlayers));
                    }
                }
            }
        });

        moreNbPlayers.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                int newNbPlayers = Integer.parseInt(nbPlayers.getText().toString()) + 1;
                nbPlayers.setText(Integer.toString(newNbPlayers));
            }
        });

        // NB PLAYERS BY TEAM EVENTS
        minusNbPlayersByTeam.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(Integer.parseInt(nbPlayersByTeam.getText().toString()) > 1) {
                    int newNbPlayersByTeam = Integer.parseInt(nbPlayersByTeam.getText().toString()) - 1;
                    nbPlayersByTeam.setText(Integer.toString(newNbPlayersByTeam));
                }
            }
        });

        moreNbPlayersByTeam.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                int newNbPlayersByTeam = Integer.parseInt(nbPlayersByTeam.getText().toString()) + 1;
                if(newNbPlayersByTeam < Integer.parseInt(nbPlayers.getText().toString())){
                    nbPlayersByTeam.setText(Integer.toString(newNbPlayersByTeam));
                }
            }
        });

        // SWITCH EVENT
        teamAlea.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(isChecked){
                    randomTeam = true;
                }else{
                    randomTeam = false;
                }
            }
        });

        // BEGIN A TOURNAMENT
        createTournament.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {

                // OPTIONS OF A CREATION OF A TOURNAMENT
                Map<String, Object> options = new HashMap<String, Object>();
                    options.put("nbPlayers", Integer.parseInt(nbPlayers.getText().toString()));
                    options.put("nbPlayersByTeam", Integer.parseInt(nbPlayersByTeam.getText().toString()));
                    options.put("type", "league");
                    options.put("bePublic", true);
                    options.put("random", randomTeam);

                // CREATE TOURNAMENT
                createTournament(options);


            }
        });
    }

    private void createTournament(Map<String, Object> options) {
        api.createTournament(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create Tournament", error); }

            public void onSuccess(Response response) throws IOException, JSONException {
                tournament = response.body().string();
                JSONObject json = new JSONObject(tournament);
                idTournament = json.getString("_id");

                // OPTIONS OF A CREATION OF TEAMS
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("idTournament", json.getString("_id"));
                options.put("nbPlayers", json.getInt("nbPlayers"));

                // CREATE TEAMS
                createTeams(options);
            }
        });

    }

    private void createTeams(Map<String, Object> options) {
        api.createTeams(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create Teams", error); }

            public void onSuccess(Response response) throws IOException, JSONException {
                String data = response.body().string();
                teams = new JSONArray(data);

                // CREATE A LEAGUE
                createLeague(idTournament);
            }
        });
    }

    private void createLeague(String idTournament) {
        api.createLeague(idTournament, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create League", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject dataLeague = new JSONObject(data);

                idLeague = dataLeague.getString("_id");

                // OPTIONS OF A CREATION OF MATCHS
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("id_league", dataLeague.getString("_id"));
                options.put("teams", teams.toString());

                // CREATE MATCHS LEAGUE
                createMatchsLeague(options);
            }
        });
    }

    private void createMatchsLeague(Map<String, Object> options) {
        api.createMatchsLeague(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create Matchs League", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();

                startNextActivity();
            }
        });
    }

    private void startNextActivity() {
        Intent intent;

        // CREATE AN ACTIVITY DEPEND TO RANDOM VALUE
        if(randomTeam == true){
            intent = new Intent(ConfigurationActivity.this, CreateRandomTeam.class);
        }else {
            intent = new Intent(ConfigurationActivity.this, CreateManualTeam.class);
        }

        // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
        intent.putExtra("TOURNAMENT", tournament);
        intent.putExtra("LEAGUE", idLeague);

        // START
        startActivity(intent);
        ConfigurationActivity.this.overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_configuration, menu);
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