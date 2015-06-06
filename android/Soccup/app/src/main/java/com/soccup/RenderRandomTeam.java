package com.soccup;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.LinearLayout;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


public class RenderRandomTeam extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        String tournament;
        Bundle extras = getIntent().getExtras();

        if (extras != null) {

            tournament = extras.getString("TOURNAMENT");

            try {
                JSONObject json = new JSONObject(tournament);
                final Api api = new Api();

                //LIST COLOR
                String[] colorList = getApplicationContext().getResources().getStringArray(R.array.color);
                final List<Integer> colors = new ArrayList<Integer>();
                for (int i = 0; i < colorList.length; i++) {
                    int newColor = Color.parseColor(colorList[i]);
                    colors.add(newColor);
                }

                // LAYOUTS
                final LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);

                // GET CURRENT TOURNAMENT
                api.getTournamentById(json.getString("_id"), new Api.ApiCallback() {

                    public void onFailure(String error) { Log.d("Get Tournament", error);}

                    public void onSuccess(Response response) throws IOException, JSONException {
                        String data = response.body().string();
                        final JSONObject json = new JSONObject(data);

                        // TEAMS
                        JSONArray teams = json.getJSONArray("teams");
                        int nbTeams = teams.length();

                        // LOOP ON TEAMS
                        for(int i = 0; i < nbTeams; i++) {
                            final LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);
                            boxTeam.removeAllViews();
                            String idTeam = teams.getString(i);

                            // GET PLAYERS OF THE TEAM
                            final int finalI = i;
                            api.getTeamPlayers(idTeam, new Api.ApiCallback() {

                                public void onFailure(String error) { Log.d("Get Teams Players", error); }

                                public void onSuccess(Response response) throws IOException, JSONException {
                                    String data = response.body().string();

                                    JSONArray json = new JSONArray(data);
                                    int nbPlayers = json.length();

                                    // LOOP ON PLAYERS
                                    for (int j = 0; j <= nbPlayers; j++) {
                                        com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_player_input, null);

                                        // CASE TEAM
                                        if(j == 0){
                                            Integer color;
                                            input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_team_input, null);
                                            input.setHint("Equipe " + (finalI + 1));
                                            input.setFloatingLabelText("Equipe " + (finalI + 1));

                                            int rand = new Random().nextInt(colors.size());
                                            color = colors.get(rand);
                                            colors.remove(rand);

                                            input.setBackgroundColor(color);
                                        }

                                        // CASE PLAYER
                                        else{
                                            JSONObject player = new JSONObject(json.getString(j - 1));
                                            input.setHint(player.getString("playerName"));
                                        }

                                        input.setKeyListener(null);
                                        boxTeam.setId(finalI);

                                        /*if(finalI > 0){
                                            int test = finalI - 1;
                                            RelativeLayout.LayoutParams relativeParams = new RelativeLayout.LayoutParams(LinearLayout.LayoutParams.FILL_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                                            relativeParams.addRule(RelativeLayout.BELOW, test);
                                            boxTeam.setLayoutParams(relativeParams);
                                        }*/

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
        getMenuInflater().inflate(R.menu.menu_render_random_team, menu);
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
