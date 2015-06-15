//
//  endController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 11/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class endController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
    
        //Get the tournament stocked before
        if let id = defaults.valueForKey("tournamentID") as? String {
            
            self.api.getTournament(id, completionHandler: {
                tournament, error in
                
                self.api.getRanking(tournament["competition_id"] as! String, orderBy: "classic", completionHandler: {
                    ranking, error in
                    self.labelWinner.text = ranking[0]["teamName"] as? String
                })
                
            })
        }

        //labelWinner.text = winner["teamName"] as? String
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(animated: Bool)
    {
        self.navigationItem.setHidesBackButton(true, animated: false)
    }
    
    @IBOutlet weak var labelWinner: UILabel!
    let defaults = NSUserDefaults.standardUserDefaults()
    let api = API()
}

