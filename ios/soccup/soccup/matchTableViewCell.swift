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
    @IBOutlet weak var card: Card!
    
    public func configure(#homeTeam: AnyObject, awayTeam: AnyObject, scoreHomeTeam: Int, scoreAwayTeam: Int, played:Bool) {

        labelNameHomeTeam.text = homeTeam["teamName"] as? String
        labelNameAwayTeam.text = awayTeam["teamName"] as? String
        labelScoreAwayTeam.textColor = UIColor(hexString: awayTeam["color"] as! String)
        labelScoreHomeTeam.textColor = UIColor(hexString: homeTeam["color"] as! String)
        
        labelScoreHomeTeam.text = String(scoreHomeTeam)
        labelScoreAwayTeam.text = String(scoreAwayTeam)
        println(played)
        
        if(!played){
            card.alpha = 0.3
        }
        else{
            card.alpha = 1
        }
    }
    
}