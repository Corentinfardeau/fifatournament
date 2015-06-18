//
//  liveMatchController.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit
import AVFoundation

class LiveMatchController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        player = AVAudioPlayer(contentsOfURL: alertGoalURL, error: nil)
        player = AVAudioPlayer(contentsOfURL: endedGameURL, error: nil)
        player.prepareToPlay()
        
        //Get the tournament stocked before
        if let id = defaults.valueForKey("tournamentID") as? String {
            
            self.api.getTournament(id, completionHandler: {
                tournament, error in
                
                self.api.getLeague(tournament["competition_id"] as! String, completionHandler: {
                    league, error in
                    
                    self.league = league
                    self.tournament = tournament
                    
                    if let firstLeg = self.league["firstLeg"] as? [Dictionary<String, AnyObject>]{
                        self.firstLeg = firstLeg
                        self.displayCurrentMatchs(self.currentFirstLegMatchIndex, currentLeg: "firstLeg")
                        self.setNextMatchLabel(self.currentFirstLegMatchIndex+1, currentLeg: "firstLeg")
                    }
                    
                    if let returnLeg = self.league["returnLeg"] as? [Dictionary<String, AnyObject>]{
                        self.returnLeg = returnLeg
                    }
                    
                })
            })
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Init the display of a match
    func initMatch(didTheGameEnded: (Bool) -> Void){
        
        self.goalAwayTeam = 0
        self.goalHomeTeam = 0
        self.labelScoreAwayTeam.text = "0"
        self.labelScoreHomeTeam.text = "0"
        self.matchIsDrawn = true
        self.currentHomePlayers = []
        self.currentAwayPlayers = []
        
        var currentLeg = ""
        
        if(self.firstLeg.count-1 > self.currentFirstLegMatchIndex){
            ++self.currentFirstLegMatchIndex
            currentLeg = "firstLeg"
            labelLeg.text = "Match aller"
            displayCurrentMatchs(currentFirstLegMatchIndex, currentLeg: currentLeg)
            
            if(self.firstLeg.count == self.currentFirstLegMatchIndex+1){
                self.setNextMatchLabel(currentReturnLegMatchIndex, currentLeg: "returnLeg")
            }else{
                self.setNextMatchLabel(currentFirstLegMatchIndex+1, currentLeg: "firstLeg")
            }
            
            didTheGameEnded(false)
            
        }else{
            if(self.returnLeg.count-1 < self.currentReturnLegMatchIndex){
                didTheGameEnded(true)
            }else{
                
                if(self.returnLeg.count == self.currentReturnLegMatchIndex+1){
                    self.labelNextMatch.text = "Il faut tout donner dans la dernière bataille."
                }else{
                    self.setNextMatchLabel(currentReturnLegMatchIndex+1, currentLeg: "returnLeg")
                }
                
                labelLeg.text = "Match retour"
                currentLeg = "returnLeg"
                displayCurrentMatchs(currentReturnLegMatchIndex, currentLeg: currentLeg)
                ++self.currentReturnLegMatchIndex
                didTheGameEnded(false)
            }
        }
    }
    
    //Display the match on the card
    func displayCurrentMatchs(matchIndex:Int, currentLeg:String){

        if(currentLeg == "firstLeg"){
            
            self.setMatchLabel(self.firstLeg[matchIndex])
            self.currentMatchID = self.firstLeg[matchIndex]["_id"] as! String
            self.setMatchToLive()
            
        }else if(currentLeg == "returnLeg"){
            
            self.setMatchLabel(self.returnLeg[matchIndex])
            self.currentMatchID = self.returnLeg[matchIndex]["_id"] as! String
            self.setMatchToLive()
            
        }
    }
    
    //Set the match to "LIVE"
    func setMatchToLive(){
        var params = ["live" : true]
        api.updateMatch(self.currentMatchID, params: params, completionHandler: {
            match, error in
        })
    }
    
    
    func setNextMatchLabel(matchIndex:Int, currentLeg:String){
        
        var str = "Match suivant : "
        var awayTeamName = ""
        var homeTeamName = ""
        
        if(currentLeg == "firstLeg"){
            if let awayTeam: AnyObject = self.firstLeg[matchIndex]["awayTeam"]{
                awayTeamName = awayTeam["teamName"] as! String
                if let homeTeam: AnyObject = self.firstLeg[matchIndex]["homeTeam"]{
                    homeTeamName = homeTeam["teamName"] as! String
                }
            }
        }else{
            if let awayTeam: AnyObject = self.returnLeg[matchIndex]["awayTeam"]{
                awayTeamName = awayTeam["teamName"] as! String
                if let homeTeam: AnyObject = self.returnLeg[matchIndex]["homeTeam"]{
                    homeTeamName = homeTeam["teamName"] as! String
                }
            }
        }
        
        self.labelNextMatch.text = "\(str) \(homeTeamName) - \(awayTeamName)"
    }
    
    
    //Set the match label to display properly
    func setMatchLabel(match:AnyObject){
        
        if let scoreHomeTeam = match["goalHomeTeam"] as? String{
            self.labelScoreHomeTeam.text = scoreHomeTeam
        }
        
        if let scoreAwayTeam = match["goalAwayTeam"] as? String{
            self.labelScoreAwayTeam.text = scoreAwayTeam
        }
        
        //Get the awayTeam and set the label & color
        if let awayTeam = match["awayTeam"] as? Dictionary<String, AnyObject>{
                
            self.currentAwayTeam = awayTeam
            self.labelNameAwayTeam.text = awayTeam["teamName"] as? String
            self.labelScoreAwayTeam.textColor = UIColor(hexString: awayTeam["color"] as! String)!
            self.buttonGoalAwayTeam.backgroundColor = UIColor(hexString: awayTeam["color"] as! String)!
            
            for i in 0..<self.currentAwayTeam["players"]!.count{
                var playersID = self.currentAwayTeam["players"] as! NSArray
                self.api.getPlayer(playersID[i] as! String, completionHandler: {
                    player, error in
                    self.currentAwayPlayers.append(player)
                })
            }
        }
        
        //Get the homeTeam and set the label & color
        if let homeTeam = match["homeTeam"] as? Dictionary<String, AnyObject>{
            
            self.currentHomeTeam = homeTeam
            self.labelNameHomeTeam.text = homeTeam["teamName"] as? String
            self.labelScoreHomeTeam.textColor = UIColor(hexString: homeTeam["color"] as! String)!
            self.buttonGoalHomeTeam.backgroundColor = UIColor(hexString: homeTeam["color"] as! String)!
            
            for i in 0..<self.currentHomeTeam["players"]!.count{
                var playersID = self.currentHomeTeam["players"] as! NSArray
                self.api.getPlayer(playersID[i] as! String, completionHandler: {
                    player, error in
                    self.currentHomePlayers.append(player)
                })
            }
        }

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
            if(self.matchIsDrawn){
                self.updateTeamPts(self.currentHomeTeam, result: "won", wasLooser: false)
                self.updateTeamPts(self.currentAwayTeam, result: "lost", wasLooser: false)
                self.matchIsDrawn = false
            }
        case -1:
            //away team win
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
                    "gd" : (gf+1)-ga
                ]
            }else{
                params = [
                    "gf" : gf,
                    "ga" : ga+1,
                    "gd" : gf-(ga+1)
                ]
            }
            
            self.api.updateTeam(team["_id"] as! String, params: params, completionHandler: {
                team, error in
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
                if(self.goalHomeTeam == 0 && self.goalAwayTeam==0){
                    params = [
                        "won" : won,
                        "drawn" : drawn+1,
                        "lost" : lost,
                        "pts" : pts+1
                    ]
                }else{
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
                }
            
            default: ()
                
            }

            self.api.updateTeam(team["_id"] as! String, params: params, completionHandler: {
                team, error in
            })
        })
    }
    
    //Goal for home team
    func homeTeamScored(){
        ++self.goalHomeTeam
        self.labelScoreHomeTeam.text = String(goalHomeTeam)
        updateMatch(self.currentHomeTeam, scoredTeam: self.currentAwayTeam)
    }
    
    //Goal for away team
    func awayTeamScored(){
        ++self.goalAwayTeam
        self.labelScoreAwayTeam.text = String(goalAwayTeam)
        updateMatch(self.currentAwayTeam, scoredTeam: self.currentHomeTeam)
    }
    
    func transition(){
        self.performSegueWithIdentifier("GoToEndController", sender:self)
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject!) {
        
        if (segue.identifier == "GoToGoalAwayModal"){
             goalSound()
            var popup = segue.destinationViewController as! goalModalController
            popup.players = self.currentAwayPlayers
            
            popup.onDataAvailable = {[weak self]
                (data) in
                if(data){
                    if let weakSelf = self {
                        weakSelf.awayTeamScored()
                    }
                }
            }
            
        }else if(segue.identifier == "GoToGoalHomeModal"){
             goalSound()
            var popup = segue.destinationViewController as! goalModalController
            popup.players = self.currentHomePlayers
            
            popup.onDataAvailable = {[weak self]
                (data) in
                if(data){
                    if let weakSelf = self {
                        weakSelf.homeTeamScored()
                    }
                }
            }
        }

    }
    
    //Trigger when the newt button is pressed
    
    @IBAction func next(sender: AnyObject){
        
        endedGameSound()
        
        //Card animation
        UIView.animateWithDuration(0.2, delay: 0.0, options: .CurveEaseIn, animations: {
            self.card.transform = CGAffineTransformMakeTranslation(-500, 0)
            self.loader.startAnimating()
            }, completion:{
                (value: Bool) in
                
                var params = [
                    "live" : false,
                    "played" : true
                ]
                
                self.api.updateMatch(self.currentMatchID, params: params, completionHandler: {
                    match, error in
                    
                    UIView.animateWithDuration(0, delay: 0, options: nil, animations: {
                        self.card.transform = CGAffineTransformMakeTranslation(500, 0)
                        }, completion:{
                            (value: Bool) in
                            self.initMatch({ end in
                                if (!end){
                                    UIView.animateWithDuration(0.2, delay: 0.0, options: .CurveEaseOut, animations: {
                                        self.card.transform = CGAffineTransformMakeTranslation(0, 0)
                                        }, completion:{
                                            (value:Bool) in
                                             self.loader.stopAnimating()
                                    })
                                }else{
                                    self.transition()
                                }
                            })
                    })
                })
        })
        
        if(self.goalHomeTeam == 0 && self.goalAwayTeam == 0){
            updateTeamPts(currentHomeTeam, result: "drawn", wasLooser: false)
            updateTeamPts(currentAwayTeam, result: "drawn", wasLooser: false)
        }
        
    }
    
    func goalSound(){
        player = AVAudioPlayer(contentsOfURL: alertGoalURL, error: nil)
        player.prepareToPlay()
        player.play()
    }
    
    func endedGameSound(){
        player = AVAudioPlayer(contentsOfURL: endedGameURL, error: nil)
        player.prepareToPlay()
        player.play()
    }
    
    @IBOutlet weak var labelNameAwayTeam: UILabel!
    @IBOutlet weak var labelNameHomeTeam: UILabel!
    
    @IBOutlet weak var labelScoreAwayTeam: UILabel!
    @IBOutlet weak var labelScoreHomeTeam: UILabel!
    
    @IBOutlet weak var buttonGoalHomeTeam: UIButton!
    @IBOutlet weak var buttonGoalAwayTeam: UIButton!
    
    @IBOutlet weak var loader: UIActivityIndicatorView!
    @IBOutlet weak var card: Card!
    
    
    
    let defaults = NSUserDefaults.standardUserDefaults()
    let api = API()
    
    var currentFirstLegMatchIndex:Int = 0
    var currentReturnLegMatchIndex:Int = 0
    
    var currentMatchID = String()
    
    var currentHomeTeam = Dictionary<String, AnyObject>()
    var currentAwayTeam = Dictionary<String, AnyObject>()
    var currentAwayPlayers = [Dictionary<String, AnyObject>]()
    var currentHomePlayers = [Dictionary<String, AnyObject>]()
    
    var league = [String:AnyObject]()
    
    var goalHomeTeam:Int = 0
    var goalAwayTeam:Int = 0
    
    var firstLeg = [Dictionary<String, AnyObject>]()
    var returnLeg = [Dictionary<String, AnyObject>]()
    
    var loosingTeam = String()
    var matchIsDrawn:Bool = true
    var updateMatchParams = Dictionary<String, AnyObject>()
    
    var tournament = Dictionary<String, AnyObject>()
    
    let alertGoalURL =  NSBundle.mainBundle().URLForResource("goal", withExtension: "aif")!
    let endedGameURL =  NSBundle.mainBundle().URLForResource("endedGame", withExtension: "aif")!
    var player = AVAudioPlayer()
    
    var goal:Bool = false
    
    
    @IBOutlet weak var labelNextMatch: label!
    @IBOutlet weak var labelLeg: labelLight!
}
