//
//  liveMatchController.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class LiveMatchController: UIViewController {

    @IBOutlet weak var labelScoreHomeTeam: UILabel!
    @IBOutlet weak var labelScoreAwayTeam: UILabel!
    
    @IBOutlet weak var labelNameHomeTeam: UILabel!
    @IBOutlet weak var labelNameAwayTeam: UILabel!
    
    @IBOutlet weak var buttonGoalHomeTeam: UIButton!
    @IBOutlet weak var buttonGoalAwayTeam: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        labelScoreHomeTeam.text = "1"
        labelScoreAwayTeam.text = "2"
        
        labelNameHomeTeam.text = "FC Barcelone"
        labelNameAwayTeam.text = "Real Madrid"
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
}
