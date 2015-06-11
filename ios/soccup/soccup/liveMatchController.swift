//
//  liveMatchController.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class LiveMatchController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        if let id = defaults.valueForKey("tournamentID") as? String {
            //println(id)
        }
        
        if let league = defaults.valueForKey("league") as? Dictionary<String, AnyObject>{
            
            if let firstLeg: AnyObject = league["firstLeg"]{
                self.firstLeg = firstLeg as! [(String)]
                self.displayCurrentMatchs(currentFirstLegMatch, currentLeg: "firstLeg")
            }
            
            if let returnLeg: AnyObject = league["returnLeg"]{
                self.returnLeg = returnLeg as! [(String)]
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(animated: Bool) {
        view.backgroundColor = mainColor
    }
    
    
    @IBAction func next(sender: AnyObject){
    
        var currentLeg = ""
        
        if(self.firstLeg.count-1 > self.currentFirstLegMatch){
            ++self.currentFirstLegMatch
            currentLeg = "firstLeg"
            displayCurrentMatchs(currentFirstLegMatch, currentLeg: currentLeg)
        }else{
            if(self.returnLeg.count-1 < self.currentReturnLegMatch){
                transition()
            }else{
                currentLeg = "returnLeg"
                displayCurrentMatchs(currentReturnLegMatch, currentLeg: currentLeg)
                ++self.currentReturnLegMatch
            }
        }
    }
    
    func displayCurrentMatchs(matchIndex:Int, currentLeg:String){

        if(currentLeg == "firstLeg"){
            api.getMatch(self.firstLeg[matchIndex], completionHandler: {
                match, error in
                if(error != nil){
                    println(error)
                }else{
                    self.setMatchLabel(match)
                    self.currentMatchID = match["_id"] as! String
                }
            })
        }else if(currentLeg == "returnLeg"){
            api.getMatch(self.returnLeg[matchIndex], completionHandler: {
                match, error in
                if(error != nil){
                    println(error)
                }else{
                    self.setMatchLabel(match)
                    self.currentMatchID = match["_id"] as! String
                }
            })
        }
    }
    
    func setMatchLabel(match:AnyObject){
        
        if let goalHomeTeam: String = match["goalHomeTeam"] as? String{
            self.labelScoreHomeTeam.text = goalHomeTeam
        }
        
        if let goalAwayTeam: String = match["goalAwayTeam"] as? String{
            self.labelScoreHomeTeam.text = goalAwayTeam
        }
        
        if let awayTeamId: String = match["awayTeam"] as? String{
            self.api.getTeam(awayTeamId, completionHandler: {
                awayTeam, error in
                self.currentAwayTeam = awayTeam
                if let awayTeamName = awayTeam["teamName"] as? String{
                    self.labelNameAwayTeam.text = awayTeamName
                }
                if let colorAwayTeam = awayTeam["color"] as? String{
                    self.labelScoreAwayTeam.textColor = UIColor(hexString: colorAwayTeam)!
                    self.buttonGoalAwayTeam.backgroundColor = UIColor(hexString: colorAwayTeam)!
                }
            })
        }
        
        if let homeTeamId: String = match["homeTeam"] as? String{
            self.api.getTeam(homeTeamId, completionHandler: {
                homeTeam, error in
                self.currentHomeTeam = homeTeam
                if let homeTeamName:String = homeTeam["teamName"] as? String{
                    self.labelNameHomeTeam.text = homeTeamName
                }
                if let colorHomeTeam = homeTeam["color"] as? String{
                    self.labelScoreHomeTeam.textColor = UIColor(hexString: colorHomeTeam)!
                    self.buttonGoalHomeTeam.backgroundColor = UIColor(hexString: colorHomeTeam)!
                }
            })
        }

    }
    
    func showPopup(teamID:String){
        
    }
    
    func updateMatch(scorerTeam:Dictionary<String, AnyObject>, scoredTeam:Dictionary<String, AnyObject>){
        
        self.updateMatchParams = ["goalHomeTeam" : self.goalHomeTeam, "goalAwayTeam" : self.goalAwayTeam]
        
        api.updateMatch(self.currentMatchID, params: self.updateMatchParams, completionHandler: {
            match, error in
            if(error != nil){
                println(error)
            }
        })
        
        var difference = self.goalHomeTeam - self.goalAwayTeam
        
        switch difference{
           
        case 1:
            //home team win
            //println("home win")
            if(self.matchIsDrawn){
                self.updateTeamPts(self.currentHomeTeam, result: "won", wasLooser: false)
                self.updateTeamPts(self.currentAwayTeam, result: "lost", wasLooser: false)
                self.matchIsDrawn = false
            }
        case -1:
            //away team win
            //println("away win")
            if(self.matchIsDrawn){
                self.updateTeamPts(self.currentAwayTeam, result: "won", wasLooser: false)
                self.updateTeamPts(self.currentHomeTeam, result: "lost", wasLooser: false)
                self.matchIsDrawn = false
            }

        case 0:
            //drawn
            self.matchIsDrawn = true
            if(loosingTeam == self.currentHomeTeam["_id"] as! String){
                self.updateTeamPts(self.currentAwayTeam, result: "drawn", wasLooser: false)
                self.updateTeamPts(self.currentHomeTeam, result: "drawn", wasLooser: true)
            }else{
                self.updateTeamPts(self.currentAwayTeam, result: "drawn", wasLooser: true)
                self.updateTeamPts(self.currentHomeTeam, result: "drawn", wasLooser: false)
            }
            
        default: ()
            
        }
        
        updateTeamGoal(scorerTeam, scorer: true)
        updateTeamGoal(scoredTeam, scorer: false)
    }
    
    func updateTeamGoal(team:Dictionary<String, AnyObject>, scorer:Bool){
        self.api.getTeam(team["_id"] as! String, completionHandler: {
            team, error in
            
            var params = Dictionary<String, AnyObject>()
            
            var gf:Int
            var ga:Int
            var gd:Int
            
            gf = team["gf"] as! Int
            ga = team["ga"] as! Int
            gd = team["gd"] as! Int
            
            if(scorer){
                params = [
                    "gf" : gf+1,
                    "ga" : ga,
                    "gd" : gf-ga
                ]
            }else{
                params = [
                    "gf" : gf,
                    "ga" : ga+1,
                    "gd" : gf-ga
                ]
            }
            
            self.api.updateTeam(team["_id"] as! String, params: params, completionHandler: {
                team, error in
                //println(team)
            })
            
        })
    }
    
    func updateTeamPts(team:Dictionary<String, AnyObject>, result:String, wasLooser:Bool){
        
        var params = Dictionary<String, AnyObject>()

        self.api.getTeam(team["_id"] as! String, completionHandler: {
            team, error in
            
            var won:Int
            var drawn:Int
            var lost:Int
            var pts:Int
            
            won = team["won"] as! Int
            drawn = team["drawn"] as! Int
            lost = team["lost"] as! Int
            pts = team["pts"] as! Int

            switch result{
                
            case "won":
                
                if(self.goalHomeTeam == 1 && self.goalAwayTeam == 0 || self.goalHomeTeam == 0 && self.goalAwayTeam == 1){
                    params = [
                        "won" : won+1,
                        "drawn" : drawn,
                        "lost" : lost,
                        "pts" : pts+3
                    ]
                }else{
                    params = [
                        "won" : won+1,
                        "drawn" : (drawn-1),
                        "lost" : lost,
                        "pts" : pts+2
                    ]
                }

            case "lost":
                
                if(self.goalHomeTeam == 1 && self.goalAwayTeam == 0 || self.goalHomeTeam == 0 && self.goalAwayTeam == 1){
                    params = [
                        "won" : won,
                        "drawn" : drawn,
                        "lost" : lost+1,
                        "pts" : pts
                    ]
                }else{
                    params = [
                        "won" : won,
                        "drawn" : (drawn-1),
                        "lost" : lost+1,
                        "pts" : pts-1
                    ]
                }
                
                self.loosingTeam = team["_id"] as! String
                
            case "drawn":
                if(wasLooser){
                    params = [
                        "won" : won,
                        "drawn" : drawn+1,
                        "lost" : (lost-1),
                        "pts" : pts+1
                    ]
                }else{
                    params = [
                        "won" : won-1,
                        "drawn" : drawn+1,
                        "lost" : lost,
                        "pts" : pts-2
                    ]
                }
            
            default: ()
            }
            
            self.api.updateTeam(team["_id"] as! String, params: params, completionHandler: {
                team, error in
                //println(team)
            })
        })
    }
    
    func transition(){
        self.performSegueWithIdentifier("GoToEndController", sender:self)
    }
    
    @IBAction func homeTeamGoal(sender: AnyObject) {
        ++self.goalHomeTeam
        self.labelScoreHomeTeam.text = String(goalHomeTeam)
        updateMatch(self.currentHomeTeam, scoredTeam: self.currentAwayTeam)
    }
    
    @IBAction func awayTeamGoal(sender: AnyObject) {
        ++self.goalAwayTeam
        self.labelScoreAwayTeam.text = String(goalAwayTeam)
        updateMatch(self.currentAwayTeam, scoredTeam: self.currentHomeTeam)
    }
    
    @IBOutlet weak var labelNameAwayTeam: UILabel!
    @IBOutlet weak var labelNameHomeTeam: UILabel!
    
    @IBOutlet weak var labelScoreAwayTeam: UILabel!
    @IBOutlet weak var labelScoreHomeTeam: UILabel!
    
    @IBOutlet weak var buttonGoalHomeTeam: UIButton!
    @IBOutlet weak var buttonGoalAwayTeam: UIButton!
    
    let defaults = NSUserDefaults.standardUserDefaults()
    let api = API()
    var currentFirstLegMatch:Int = 0
    var currentReturnLegMatch:Int = 0
    var currentMatchID = String()
    var currentHomeTeam = Dictionary<String, AnyObject>()
    var currentAwayTeam = Dictionary<String, AnyObject>()
    var goalHomeTeam:Int = 0
    var goalAwayTeam:Int = 0
    var firstLeg = [String]()
    var returnLeg = [String]()
    var loosingTeam = String()
    var matchIsDrawn:Bool = true
    var updateMatchParams = Dictionary<String, AnyObject>()
    
}
