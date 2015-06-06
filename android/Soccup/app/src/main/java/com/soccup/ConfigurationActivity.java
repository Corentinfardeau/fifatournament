package com.soccup;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.TextView;

import com.squareup.okhttp.Response;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public class ConfigurationActivity extends Activity {
    private Boolean randomTeam = false;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_configuration);

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
                final Api api = new Api();

                // OPTIONS OF A CREATION OF A TOURNAMENT
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("nbPlayers", Integer.parseInt(nbPlayers.getText().toString()));
                options.put("nbPlayersByTeam", Integer.parseInt(nbPlayersByTeam.getText().toString()));
                options.put("type", "league");
                options.put("bePublic", true);
                options.put("random", randomTeam);

                // CREATE TOURNAMENT
                api.createTournament(options, new Api.ApiCallback() {
                    public void onFailure(String error) {
                        Log.d("Create Tournament", error);
                    }

                    public void onSuccess(Response response) throws IOException, JSONException {
                        final String tournament = response.body().string();
                        JSONObject json = new JSONObject(tournament);

                        // OPTIONS OF A CREATION OF TEAMS
                        Map<String, Object> options = new HashMap<String, Object>();
                        options.put("idTournament", json.getString("_id"));
                        options.put("nbPlayers", json.getInt("nbPlayers"));

                        // CREATE TEAMS
                        api.createTeams(options, new Api.ApiCallback() {
                            public void onFailure(String error) { Log.d("Create Teams", error); }

                            public void onSuccess(Response response) throws IOException, JSONException {
                                Intent intent;

                                // CREATE AN ACTIVITY DEPEND TO RANDOM VALUE
                                if(randomTeam == true){
                                    intent = new Intent(ConfigurationActivity.this, CreateRandomTeam.class);
                                }else {
                                    intent = new Intent(ConfigurationActivity.this, CreateManualTeam.class);
                                }

                                // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
                                intent.putExtra("TOURNAMENT", tournament);

                                // START
                                startActivity(intent);
                                ConfigurationActivity.this.overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
                            }
                        });
                    }
                });
            }
        });
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