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
    
    
    @IBAction func next(sender: AnyObject){
    
        var currentLeg = ""
        
        if(self.firstLeg.count-1 > self.currentFirstLegMatch){
            ++self.currentFirstLegMatch
            currentLeg = "firstLeg"
            displayCurrentMatchs(currentFirstLegMatch, currentLeg: currentLeg)
        }else{
            if(self.returnLeg.count-1 < self.currentReturnLegMatch){
                println("fini")
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
                }
            })
        }else if(currentLeg == "returnLeg"){
            api.getMatch(self.returnLeg[matchIndex], completionHandler: {
                match, error in
                if(error != nil){
                    println(error)
                }else{
                    self.setMatchLabel(match)
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
    
    @IBAction func homeTeamGoal(sender: AnyObject) {
    
    }
    
    @IBAction func awayTeamGoal(sender: AnyObject) {
    
    }
    
    func updateMatch(){
        
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
    
    var firstLeg = [String]()
    var returnLeg = [String]()
    
}
