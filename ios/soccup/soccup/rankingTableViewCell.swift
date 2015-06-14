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
    @IBOutlet weak var labelPlayed: UILabel!
    @IBOutlet weak var labelWon: UILabel!
    @IBOutlet weak var labelLost: UILabel!
    @IBOutlet weak var labelDrawn: UILabel!
    @IBOutlet weak var labelGd: UILabel!
    @IBOutlet weak var labelPts: UILabel!
    
    @IBOutlet weak var labelNameTeamStats: UILabel!
    @IBOutlet weak var labelPlayedStats: UILabel!
    @IBOutlet weak var labelWonStats: UILabel!
    @IBOutlet weak var labelLostStats: UILabel!
    @IBOutlet weak var labelDrawnStats: UILabel!
    @IBOutlet weak var labelGdStats: UILabel!
    @IBOutlet weak var labelPtsStats: UILabel!
    
    public func configure(#nameTeam: String, played: Int, won: Int, lost:Int, drawn: Int, gd: Int, pts:Int, color:String) {
        labelNameTeam.text = nameTeam
        labelNameTeam.textColor = UIColor(hexString: color)
        labelPlayed.text =  String(played)
        labelWon.text = String(won)
        labelDrawn.text = String(drawn)
        labelLost.text = String(lost)
        labelGd.text = String(gd)
        labelPts.text = String(pts)
    }
    
    public func configureStats(#nameTeam: String, played: Int, won: Int, lost:Int, drawn: Int, gd: Int, pts:Int, color:String) {
        labelNameTeamStats.text = nameTeam
        labelNameTeamStats.textColor = UIColor(hexString: color)
        labelPlayedStats.text =  String(played)
        labelWonStats.text = String(won)
        labelDrawnStats.text = String(drawn)
        labelLostStats.text = String(lost)
        labelGdStats.text = String(gd)
        labelPtsStats.text = String(pts)
    }
    
    public func configureFirstLine() {
        labelNameTeam.text = "Equipe"
        labelPlayed.text =  "J"
        labelWon.text = "G"
        labelDrawn.text = "N"
        labelLost.text = "D"
        labelGd.text = "DB"
        labelPts.text = "Pts"
    }
    
    public func configureFirstLineStats() {
        labelNameTeamStats.text = "Equipe"
        labelPlayedStats.text =  "J"
        labelWonStats.text = "G"
        labelDrawnStats.text = "N"
        labelLostStats.text = "D"
        labelGdStats.text = "DB"
        labelPtsStats.text = "Pts"
    }
    
}
