//
//  rankingTableViewCell.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

public class RankingTableViewCell: UITableViewCell {
    
    @IBOutlet weak var labelNameTeam: UILabel!
    
    public func configure(#nameTeam: String) {
        labelNameTeam.text = nameTeam
    }
    
}
