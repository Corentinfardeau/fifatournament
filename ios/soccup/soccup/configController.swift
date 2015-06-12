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
        self.labelNbPlayers.text = "\(nbPlayers)"
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    @IBOutlet weak var labelNbPlayers: UILabel!
    @IBOutlet weak var labelNbPlayersByTeam: UILabel!

    
    let api = API()
    var random:Bool = false
    var nbPlayers:Int = 2
    var nbPlayersByTeam:Int = 1
    var tournamentID:String = ""
    var teams = [Dictionary<String, AnyObject>]()
    let defaults = NSUserDefaults.standardUserDefaults()
    
    @IBAction func incNbPlayers(sender: AnyObject) {
        self.nbPlayers++
        self.labelNbPlayers.text = "\(nbPlayers)"
    }

    @IBAction func decNbPlayers(sender: AnyObject) {
        if self.nbPlayers > 2 {
            self.nbPlayers--
            
            if self.nbPlayers == self.nbPlayersByTeam {
                self.nbPlayersByTeam--
                self.labelNbPlayersByTeam.text = "\(nbPlayersByTeam)"
            }
        }
        self.labelNbPlayers.text = "\(nbPlayers)"
    }
    
    @IBAction func incNbPlayersTeam(sender: AnyObject) {
        if self.nbPlayersByTeam < (self.nbPlayers - 1){
            self.nbPlayersByTeam++
        }
        self.labelNbPlayersByTeam.text = "\(nbPlayersByTeam)"
    }
    
    @IBAction func decNbPlayersTeam(sender: AnyObject) {
        if self.nbPlayersByTeam>2 {
            self.nbPlayersByTeam--
        }
        self.labelNbPlayersByTeam.text = "\(nbPlayersByTeam)"
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
                if let id = tournament["_id"] as? String{
                    self.api.createTeams(id, nbPlayers : self.nbPlayers, completionHandler : {
                        teams, error in
                        if((error) != nil){
                            println(error)
                        }else{
                            self.teams = teams as! [(Dictionary<String, AnyObject>)]
                            self.tournamentID = id
                            self.api.createLeague(self.tournamentID, completionHandler:{
                                league, error in
                                if(error != nil){
                                    println(error)
                                }else{
                                    self.api.createMatchs(league["_id"] as! String, teams: teams as! Array, completionHandler: {
                                        matchs, error in
                                        self.defaults.setValue(matchs, forKey: "league")
                                        self.defaults.synchronize()
                                        self.transition(self.random)
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject!) {
        if (segue.identifier == "GoToRandomController") {
            var randomC = segue.destinationViewController as! randomController
            randomC.tournamentID = self.tournamentID
            randomC.nbPlayers = self.nbPlayers
        }else if (segue.identifier == "GoToReadyController"){
            var readyC = segue.destinationViewController as! readyController
            readyC.tournamentID = self.tournamentID
            readyC.teams = self.teams
        }
    
    }
    
    func transition(random: Bool) {
        if(self.random){
            self.performSegueWithIdentifier("GoToRandomController", sender:self)
        }else{
            self.performSegueWithIdentifier("GoToReadyController", sender:self)
        }
    }
}
