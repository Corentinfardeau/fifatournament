//
//  configController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 29/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class configController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBOutlet weak var labelNbPlayers: UILabel!
    @IBOutlet weak var labelNbPlayersByTeam: UILabel!
    let api = API()
    let localStorage = NSUserDefaults.standardUserDefaults()
    var random:Bool = false
    var nbPlayers:Int = 2
    var nbPlayersByTeam:Int = 1
    
    @IBAction func stepperNbPlayers(sender: UIStepper) {
        labelNbPlayers.text = Int(sender.value).description
        nbPlayers = Int(sender.value)
    }
    
    
    @IBAction func stepperNbPlayersByTeam(sender: UIStepper) {
        labelNbPlayersByTeam.text = Int(sender.value).description
        nbPlayersByTeam = Int(sender.value)
    }
    
    @IBAction func switchRandom(sender: UISwitch) {
        random = sender.on
    }
    
    @IBAction func saveConfig(sender: AnyObject) {
        
        self.api.createTournament("league", publicBool: false, random: self.random, nbPlayers: self.nbPlayers, nbPlayersByTeam: self.nbPlayersByTeam, completionHandler: {
            tournament, error in
            if((error) != nil){
                println(error)
            }else{
                var id:String = tournament["_id"] as! String
                self.api.createTeams(id, nbPlayers : self.nbPlayers, completionHandler : {
                    teams, error in
                    if((error) != nil){
                        println(error)
                    }else{
                        self.localStorage.setValue(id, forKey: "tournament")
                    }
                })
            }
        })
        
        transition(random)
    }
    
    
    func transition(random: Bool) {
        
        if(self.random){
            self.performSegueWithIdentifier("GoToRandomController", sender:self)
        }else{
            self.performSegueWithIdentifier("GoToReadyController", sender:self)
        }
    }
}
