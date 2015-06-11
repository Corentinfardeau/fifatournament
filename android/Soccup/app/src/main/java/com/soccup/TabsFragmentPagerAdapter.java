package com.soccup;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

public class TabsFragmentPagerAdapter extends FragmentPagerAdapter {

    private final String[] TITLES = { "MATCH", "MATCH EN COURS", "CLASSEMENT" };

    public TabsFragmentPagerAdapter(FragmentManager fm) {
        super(fm);
    }

    @Override
    public CharSequence getPageTitle(int position) {
        return TITLES[position];
    }

    @Override
    public int getCount() {
        return TITLES.length;
    }

    public Fragment getItem(int index) {
        return RankFragment.newInstance(index + 1);
    }

}