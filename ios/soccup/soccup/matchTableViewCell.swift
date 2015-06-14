//
//  matchTableViewCell.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

public class MatchTableViewCell: UITableViewCell {
    
    
    @IBOutlet weak var labelNameHomeTeam: UILabel!
    @IBOutlet weak var labelNameAwayTeam: UILabel!
    
    @IBOutlet weak var labelScoreHomeTeam: UILabel!
    @IBOutlet weak var labelScoreAwayTeam: UILabel!

    public func configure(#nameHomeTeam: String, nameAwayTeam: String, scoreHomeTeam: String, scoreAwayTeam: String) {
        labelNameHomeTeam.text = nameHomeTeam
        labelNameAwayTeam.text = nameAwayTeam
        
        labelScoreHomeTeam.text = scoreHomeTeam
        labelScoreAwayTeam.text = scoreAwayTeam
    }
    
}