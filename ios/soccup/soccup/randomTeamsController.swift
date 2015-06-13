//
//  randomTeamsController.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import UIKit

class randomTeamsController: UIViewController, UITableViewDataSource, UITableViewDelegate  {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.$
        api.getTournament(tournamentID, completionHandler: {
            result, error in
            if(error != nil){
                println(error)
            }else{
                self.tournament = result
            }
        })
        
        self.view.backgroundColor = backgroundColor
        var backgroundView = UIView(frame: CGRectZero)
        self.tableView.tableFooterView = backgroundView
        self.tableView.backgroundColor = UIColor.clearColor()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func updateTeam(){
        
        var params = Dictionary<String, AnyObject>()
        
        for index in 0..<self.teamsName.count{
            println(self.teamsName[index])
            params = [
                "teamName" : self.teamsName[index]
            ]
            
            if let teams: AnyObject = tournament["teams"]{
                self.api.updateTeam(teams[index] as! String, params: params, completionHandler: {
                    team, error in
                    //println(team)
                })
            }
        }
        
    }
    
    func displayError(message:String){
        let alert = UIAlertView()
        alert.message = message
        alert.addButtonWithTitle("OK")
        alert.show()
    }
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return teams.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection team: Int) -> Int {
        return (teams[team]["nbPlayers"] as! Int)+1
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! RandomTeamCell
        
        if(indexPath.row == 0){
            var textField = cell.configureRandomTeam(text: "", placeholder: "Nom de l'équipe \(indexPath.section+1)", color:self.teams[indexPath.section]["color"] as! String)
            teamsNameTextField.append(textField)
        }else{
            var textField = cell.configureDisableTextField(text: self.playersName[cpt])
            ++cpt
        }
        
        cell.selectionStyle = UITableViewCellSelectionStyle.None
        
        return cell
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection team: Int) -> String? {
        return teams[team]["teamName"] as? String
    }
    
    func tableView(tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        let header: UITableViewHeaderFooterView = view as! UITableViewHeaderFooterView
        header.contentView.backgroundColor = backgroundColor
        header.textLabel.textColor = secondaryColor
        header.textLabel.font = UIFont(name: "SourceSansPro-Regular", size: 15)
    }
    
    func tableView(tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 60.0
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject!) {
        if (segue.identifier == "GoToLiveMatchControllerFromRandom") {
            self.defaults.setValue(self.tournamentID, forKey:"tournamentID")
            self.defaults.synchronize()
            
            self.api.createPlayers(tournamentID, players: playersName, completionHandler: {
                player, error in
                if(error != nil){
                    println(error)
                }else{
                    
                }
            })
        }
    }
    
    override func shouldPerformSegueWithIdentifier(identifier: String!, sender: AnyObject!) -> Bool {
        
        for index in 0..<teamsNameTextField.count{
            if(teamsNameTextField[index].text != ""){
                teamsName.append(teamsNameTextField[index].text)
                verifTeam = true
            }else{
                verifTeam = false
                break
            }
        }

        if(!verifTeam){
            displayError("Les noms des équipes n'ont pas toutes été remplit.")
            return false
        }else{
            updateTeam()
            return true
        }
    }
    
    @IBOutlet weak var tableView: UITableView!
    var tournamentID:String!
    var playersName:[String]!
    var teams = [Dictionary<String, AnyObject>]()
    var tournament = Dictionary<String, AnyObject>()
    var cpt:Int = 0
    let api = API()
    var verifTeam:Bool = true
    var teamsNameTextField = [UITextField]()
    var teamsName = [String]()
    let defaults = NSUserDefaults.standardUserDefaults()
    
}
