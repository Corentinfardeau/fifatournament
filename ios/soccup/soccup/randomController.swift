//
//  randomController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 31/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import UIKit

class randomController: UIViewController, UITableViewDataSource, UITableViewDelegate  {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        api.getTournament(tournamentID, completionHandler: {
            result, error in
            if(error != nil){
                println(error)
            }else{
                self.tournament = result
                if let teams: AnyObject = self.tournament["teams"]{
                    for index in 0...teams.count()-1{
                        self.api.getTeam(teams[index] as! String, completionHandler:{
                            result, error in
                            if(error != nil){
                                println(error)
                            }else{
                                if let tn: String = result["teamName"] as? String{
                                    self.teamsName.append(tn)
                                }
                            }
                            
                        })
                    }
                }
            }
        })
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    let api = API()
    var tournamentID:String!
    var nbPlayers:Int!
    var tournament = Dictionary<String, AnyObject>()
    var teamsName = [String]()
    var nbPlayersByTeam:Int = 0
    var playersName = [String]()
    var arrayTextField = [UITextField]()
    var verif:Bool = true
    
    @IBAction func shuffleButton(sender: AnyObject) {
        
        for index in 0...arrayTextField.count-1{
            if(arrayTextField[index].text != ""){
                playersName.append(arrayTextField[index].text)
            }else{
                verif = false
                let alert = UIAlertView()
                alert.message = "Les joueurs n'ont tous été remplit. "
                alert.addButtonWithTitle("OK")
                alert.show()
                break
            }
        }
        
        if(verif){
            var playersNameShuffle = shuffle(playersName)
            createPlayers(playersNameShuffle)
        }
    }
    
    func shuffle<C: MutableCollectionType where C.Index == Int>(var list: C) -> C {
        let c = count(list)
        for i in 0..<(c - 1) {
            let j = Int(arc4random_uniform(UInt32(c - i))) + i
            swap(&list[i], &list[j])
        }
        return list
    }
    
    func createPlayers(playersNameShuffle:NSArray){
        api.createPlayers(tournamentID, players: playersNameShuffle, completionHandler: {
            result, error in
            if(error != nil){
                println(error)
            }
            else{
                self.transition()
            }
        })
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject!) {
        if (segue.identifier == "GoToRandomTeamsController") {
            var randomT = segue.destinationViewController as! randomTeamsController;
            randomT.tournamentID = self.tournamentID
            randomT.playersName = self.playersName
            randomT.teamsName = self.teamsName
            randomT.nbPlayersByTeam = self.nbPlayersByTeam
        }
    }
    
    func transition(){
        
        self.performSegueWithIdentifier("GoToRandomTeamsController", sender:self)
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection teams: Int) -> Int {
        return nbPlayers
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! TextInputTableViewCell
        var textField:UITextField = cell.configure(text: "", placeholder: "Nom du joueur \(indexPath.row+1)")
        arrayTextField.append(textField)
        return cell
    }
}
