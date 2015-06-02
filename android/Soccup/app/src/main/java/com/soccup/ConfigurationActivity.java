package com.soccup;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;


public class ConfigurationActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_configuration);

        /*Button createTournament = (Button) findViewById(R.id.btnBegin);
        createTournament.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                TextView nbPlayers = (TextView) findViewById(R.id.nbPlayers);
                TextView nbPlayersByTeam = (TextView) findViewById(R.id.nbPlayersByTeam);

                Map<String, Object> options = new HashMap<String, Object>();
                    options.put("type", "league");
                    options.put("bePublic", true);
                    options.put("random", true);
                    options.put("nbPlayers", Integer.parseInt(nbPlayers.getText().toString()));
                    options.put("nbPlayersByTeam", Integer.parseInt(nbPlayersByTeam.getText().toString()));

                final Api api = new Api();
                api.createTournament(options, new Api.ApiCallback() {
                    public void onFailure(String error) {
                        Log.d("Error", error);
                    }

                    public void onSuccess(Response response) throws IOException, JSONException {
                        String json = response.body().string();
                        Log.d("test", json);
                        JSONObject forecast = new JSONObject(json);

                        api.getCompetitionTournament(forecast.getString("_id"), new Api.ApiCallback() {
                            public void onFailure(String error) {
                                Log.d("Error", error);
                            }

                            public void onSuccess(Response response) throws IOException, JSONException {
                                Log.d("get", response.body().string());
                            }
                        });
                    }
                });
            }
        });*/
    }


    @Override
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
