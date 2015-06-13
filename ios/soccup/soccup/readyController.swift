//
//  readyController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 31/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import UIKit

class readyController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        api.getTournament(tournamentID, completionHandler:{
            tournament, error in
            if((error) != nil){
                println(error)
            }else{
                self.tournament = tournament
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

    override func shouldPerformSegueWithIdentifier(identifier: String!, sender: AnyObject!) -> Bool {
        
        for index in 0..<arrayPlayerTextField.count{
            if(arrayPlayerTextField[index].text != ""){
                playersName.append(arrayPlayerTextField[index].text)
                verifPlayer = true
            }else{
                verifPlayer = false
                break
            }
        }
        
        for index in 0..<arrayTeamTextField.count{
            if(arrayTeamTextField[index].text != ""){
                teamName.append(arrayTeamTextField[index].text)
                verifTeam = true
            }else{
                verifTeam = false
                break
            }
        }
        
        if(!verifPlayer) {
            displayError("Les noms des joueurs n'ont pas tous été remplit.")
            return false
        }else{
            if(!verifTeam){
                displayError("Les noms des équipes n'ont pas toutes été remplit.")
                return false
            }else{
                savePlayer()
                updateTeam()
                return true
            }
        }
        
    }
    
    func savePlayer(){
        self.api.createPlayers(tournamentID, players: playersName, completionHandler: {
            players, error in
            if(error != nil){
                println(error)
            }else{
                //println(players)
            }
        })
    }
    
    func updateTeam(){
        
        var params = Dictionary<String, AnyObject>()
        
        for index in 0..<self.teamName.count{
            
            params = [
                "teamName" : self.teamName[index]
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
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject!) {
        self.defaults.setValue(self.tournamentID, forKey:"tournamentID")
        self.defaults.synchronize()
    }

    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return teams.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection teams: Int) -> Int {
        return (self.teams[teams]["nbPlayers"] as? Int)!+1
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! TextInputTableViewCell
        
        if(indexPath.row == 0){
            var textField = cell.configureTeam(text: "", placeholder: "Nom de l'équipe \(indexPath.section+1)", color:self.teams[indexPath.section]["color"] as! String)
            arrayTeamTextField.append(textField)
        }else{
            var textField = cell.configurePlayer(text: "", placeholder: "Nom du joueur \(indexPath.row)")
            arrayPlayerTextField.append(textField)
        }
        
        cell.selectionStyle = UITableViewCellSelectionStyle.None

        return cell
        
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection teams: Int) -> String? {
        return "Equipe \(teams+1)"
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
    
    let api = API()
    var tournamentID:String!
    var tournament = Dictionary<String, AnyObject>()
    var teams:[Dictionary<String, AnyObject>]!
    var arrayPlayerTextField = [UITextField]()
    var arrayTeamTextField = [UITextField]()
    var playersName = [String]()
    var teamName = [String]()
    let defaults = NSUserDefaults.standardUserDefaults()
    var verifPlayer:Bool = true
    var verifTeam:Bool = true
}