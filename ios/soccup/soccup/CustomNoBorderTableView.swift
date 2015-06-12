//
//  CustomNoBorderTableView.swift
//  soccup
//
//  Created by Maxime DAGUET on 08/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class CustomNoBorderTableView: UITableView {
    required init(coder decoder: NSCoder) {
        super.init(coder: decoder)
        
        //self.separatorStyle = UITableViewCellSeparatorStyle.None
        self.sectionHeaderHeight = 50
        
//        CGFloat dummyViewHeight = 40;
//        UIView *dummyView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.tableView.bounds.size.width, dummyViewHeight)];
//        self.tableView.tableHeaderView = dummyView;
//        self.tableView.contentInset = UIEdgeInsetsMake(-dummyViewHeight, 0, 0, 0);
        
    }
}