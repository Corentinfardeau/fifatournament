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
    
    public func configure(#nameTeam: String, played: Int, won: Int, lost:Int, drawn: Int, gd: Int, pts:Int) {
        labelNameTeam.text = nameTeam
        labelPlayed.text =  String(played)
        labelWon.text = String(won)
        labelDrawn.text = String(drawn)
        labelLost.text = String(lost)
        labelGd.text = String(gd)
        labelPts.text = String(pts)
    }
    
}
