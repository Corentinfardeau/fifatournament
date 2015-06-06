package com.soccup;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

/**
 * Created by Valentin on 04/06/2015.
 */
public class CreateManualTeam extends Activity {
    private String tournament;
    private String idTournament;
    private Api api = new Api();

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        Bundle extras = getIntent().getExtras();

        Button btnCreateTeam = (Button)findViewById(R.id.btnCreateTeam);

        // BTN CREATE EVENT
        btnCreateTeam.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                Intent intent = new Intent(CreateManualTeam.this, CurrentTournament.class);
                startActivity(intent);
                overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
            }
        });

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            try {
                JSONObject json = new JSONObject(tournament);
                idTournament = json.getString("_id");

                // LAYOUTS
                final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);

                // GET THE CURRENT TOURNAMENT
                api.getTournamentById(idTournament, new Api.ApiCallback() {

                    public void onFailure(String error) { Log.d("Get Tournament", error);}

                    public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                        String data = response.body().string();
                        final JSONObject json = new JSONObject(data);

                        // TEAMS
                        JSONArray teams = json.getJSONArray("teams");
                        int nbTeams = teams.length();

                        // LOOP ON TEAMS
                        for(int i = 0; i < nbTeams; i++) {
                            final int finalI = i;
                            final String idTeam = teams.getString(i);
                            final LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);

                            boxTeam.removeAllViews();

                            // GET THE TEAM
                            api.getTeam(idTeam, new Api.ApiCallback() {
                                public void onFailure(String error) { Log.d("Get Teams", error); }

                                public void onSuccess(Response response) throws IOException, JSONException {
                                    String data = response.body().string();
                                    JSONObject jsonData = new JSONObject(data);
                                    String color = "#000000";//jsonData.getString("color");

                                    // CREATE INPUT FOR TEAM
                                    com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_team_input, null);
                                    input.setHint(jsonData.getString("teamName"));
                                    input.setFloatingLabelText(jsonData.getString("teamName"));
                                    input.setBackgroundColor(Color.parseColor(color));

                                    input.setKeyListener(null);
                                    boxTeam.setId(finalI);
                                    boxTeam.addView(input);

                                    // LOOP OF NBPLAYERS
                                    for (int j = 0; j < jsonData.getInt("nbPlayers"); j++) {
                                        input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_player_input, null);
                                        input.setHint("Joueur " + (j + 1));
                                        input.setFloatingLabelText("Joueur " + (j + 1));
                                        boxTeam.addView(input);
                                    }

                                    // RUN UI
                                    runOnUiThread(new Runnable() {
                                        public void run() {
                                            boxContentTeam.addView(boxTeam);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
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
