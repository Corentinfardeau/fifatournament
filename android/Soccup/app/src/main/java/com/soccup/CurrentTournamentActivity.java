package com.soccup;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.view.Menu;
import android.widget.Toast;

import com.astuetz.PagerSlidingTabStrip;


public class CurrentTournamentActivity extends FragmentActivity{

    private PagerSlidingTabStrip tabs;
    private ViewPager viewPager;
    private TabsFragmentPagerAdapter adapter;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_current_tournament);

        tabs = (PagerSlidingTabStrip) findViewById(R.id.tabs);
        viewPager = (ViewPager) findViewById(R.id.pager);
        adapter = new TabsFragmentPagerAdapter(getSupportFragmentManager());

        viewPager.setAdapter(adapter);
        tabs.setViewPager(viewPager);

        tabs.setOnPageChangeListener(new ViewPager.OnPageChangeListener() {

            public void onPageSelected(int position) {
                Toast.makeText(CurrentTournamentActivity.this,
                        "Selected page position: " + position, Toast.LENGTH_SHORT).show();
            }


            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                // Code goes here
            }


            public void onPageScrollStateChanged(int state) {
                // Code goes here
            }
        });
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
}
