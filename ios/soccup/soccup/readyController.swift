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
    }

    let api = API()
    var tournamentID:String!
    var tournament = Dictionary<String, AnyObject>()
    var teams:[Dictionary<String, AnyObject>]!
    var arrayTextField = [UITextField]()
    var playersName = [String]()
    let defaults = NSUserDefaults.standardUserDefaults()
    var verif:Bool = true
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func shouldPerformSegueWithIdentifier(identifier: String!, sender: AnyObject!) -> Bool {
        
        for index in 0..<arrayTextField.count{
            if(arrayTextField[index].text != ""){
                playersName.append(arrayTextField[index].text)
                verif = true
            }else{
                verif = false
                break
            }
        }
        
        if(verif){
            self.api.createPlayers(tournamentID, players: playersName, completionHandler: {
                players, error in
                if(error != nil){
                    println(error)
                }else{
                    //println(players)
                }
            })
        }
        
        if (!verif) {
            let alert = UIAlertView()
            alert.message = "Les joueurs n'ont tous été remplit. "
            alert.addButtonWithTitle("OK")
            alert.show()
            return false
        }else{
            return true
        }
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject!) {
        self.defaults.setValue(self.tournamentID, forKey:"tournamentID")
        self.defaults.synchronize()
    }

    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return teams.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection teams: Int) -> Int {
        return (self.teams[teams]["nbPlayers"] as? Int)!
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! TextInputTableViewCell
        var textField = cell.configure(text: "", placeholder: "Nom du joueur")
        arrayTextField.append(textField)
        return cell
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection teams: Int) -> String? {
        return self.teams[teams]["teamName"] as? String
    }

//    Plus utile, a supprimer surement
//    func tableView(tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
//        let header: UITableViewHeaderFooterView = view as! UITableViewHeaderFooterView
//        header.contentView.backgroundColor = UIColor.whiteColor()
//        header.textLabel.textColor = UIColor.lightGrayColor()
//        header.textLabel.font = UIFont(name: "SourceSansPro-Regular", size: 15)
//        header.textLabel.textAlignment = NSTextAlignment.Center
//    }
}