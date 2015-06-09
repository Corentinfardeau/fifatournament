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
        
        self.separatorStyle = UITableViewCellSeparatorStyle.None
        self.sectionHeaderHeight = 50
    }
}