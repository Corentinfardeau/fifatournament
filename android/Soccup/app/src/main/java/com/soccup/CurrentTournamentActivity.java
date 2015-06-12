package com.soccup;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.Menu;

import com.astuetz.PagerSlidingTabStrip;


public class CurrentTournamentActivity extends FragmentActivity{

    private PagerSlidingTabStrip tabs;
    private ViewPager viewPager;
    private TabsFragmentPagerAdapter adapter;
    private Bundle extras;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_current_tournament);
        extras = getIntent().getExtras();

        tabs = (PagerSlidingTabStrip) findViewById(R.id.tabs);
        tabs.setTextColor(0xFFFFFFFF);
        tabs.setDividerColor(0xFF00E676);
        tabs.setIndicatorColor(0xFFFFFFFF);
        tabs.setUnderlineHeight(0);
        tabs.setIndicatorHeight(6);

        viewPager = (ViewPager) findViewById(R.id.pager);
        adapter = new TabsFragmentPagerAdapter(getSupportFragmentManager());

        viewPager.setAdapter(adapter);
        tabs.setViewPager(viewPager);

        tabs.setOnPageChangeListener(new ViewPager.OnPageChangeListener() {

            public void onPageSelected(int position) {
                Log.d("onPageSelected: ", position + "");
                if(position == 1) {
                    MatchsFragment frg = (MatchsFragment)adapter.instantiateItem(viewPager, position);
                    frg.reload();
                }else if(position == 2) {
                    RankFragment frg = (RankFragment)adapter.instantiateItem(viewPager, position);
                    frg.reload();
                }
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

    public Bundle getExtras(){
        return extras;
    }
}
