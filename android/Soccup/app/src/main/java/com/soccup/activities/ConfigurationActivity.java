package com.soccup.activities;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.TextView;

import com.soccup.R;
import com.soccup.models.League;
import com.soccup.models.Tournament;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class ConfigurationActivity extends AppCompatActivity {
    private Boolean randomTeam = false;
    private String tournament;
    private Toolbar mToolbar;

    // MODELS
    private Tournament currentTournament = new Tournament();
    private League currentLeague = new League();

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_configuration);

        // TOOLBAR
        mToolbar = (Toolbar) findViewById(R.id.tool_bar);
        setSupportActionBar(mToolbar);

        // SHOW NAVIGATION BACK
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.arrow_back);

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
                if(isChecked){ randomTeam = true; }
                else{ randomTeam = false;   }
            }
        });

        // BEGIN A TOURNAMENT
        createTournament.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {

                newTournament(nbPlayers, nbPlayersByTeam);
            }
        });
    }

    private void newTournament(TextView nbPlayers, TextView nbPlayersByTeam) {

        // OPTIONS OF A CREATION OF A TOURNAMENT
        Map<String, Object> options = new HashMap<String, Object>();
        options.put("nbPlayers", Integer.parseInt(nbPlayers.getText().toString()));
        options.put("nbPlayersByTeam", Integer.parseInt(nbPlayersByTeam.getText().toString()));
        options.put("type", "league");
        options.put("bePublic", true);
        options.put("random", randomTeam);

        // CREATE TOURNAMENT
        currentTournament.createTournament(options, new Tournament.Callback() {
            public void onSuccess(Map<String, Object> options) throws JSONException {
                JSONObject data = (JSONObject) options.get("tournament");
                tournament = data.toString();

                // CREATE TEAMS
                currentTournament.createTeams(new Tournament.Callback() {
                    public void onSuccess(Map<String, Object> options) throws JSONException {

                        // CREATE LEAGUE
                        currentLeague.createLeague(currentTournament.getIdTournament(), new League.Callback() {
                            public void onSuccess(Map<String, Object> options) throws JSONException {
                                JSONObject dataLeague = (JSONObject) options.get("league");

                                // OPTIONS OF A CREATION OF MATCHS
                                Map<String, Object> optionsCreateMatchs = new HashMap<String, Object>();
                                optionsCreateMatchs.put("id_league", currentLeague.getIdLeague());
                                optionsCreateMatchs.put("teams", currentTournament.getTeams().toString());

                                // CREATE MATCHS
                                currentLeague.createMatchs(optionsCreateMatchs, new League.Callback() {
                                    public void onSuccess(Map<String, Object> options) throws JSONException {
                                        startNextActivity();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    private void startNextActivity() {
        Intent intent;

        // CREATE AN ACTIVITY DEPEND TO RANDOM VALUE
        if(randomTeam == true){  intent = new Intent(ConfigurationActivity.this, CreateRandomTeam.class); }
        else {  intent = new Intent(ConfigurationActivity.this, CreateManualTeam.class); }

        // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
        intent.putExtra("TOURNAMENT", tournament);
        intent.putExtra("LEAGUE", currentLeague.getIdLeague());

        // START
        startActivity(intent);
        ConfigurationActivity.this.overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}