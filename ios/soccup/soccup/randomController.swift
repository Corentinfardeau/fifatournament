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
    
    @IBOutlet weak var tableView: UITableView!
    
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
                    for index in 0...teams.count-1{
                        self.api.getTeam(teams[index] as! String, completionHandler:{
                            result, error in
                            if(error != nil){
                                println(error)
                            }else{
                                self.teams.append(result)
                            }
                        })
                    }
                }
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
    
    let api = API()
    var tournamentID:String!
    var nbPlayers:Int!
    var tournament = Dictionary<String, AnyObject>()
    var playersName = [String]()
    var playersNameShuffle = [String]()
    var arrayTextField = [UITextField]()
    var verif:Bool = true
    var teams = [Dictionary<String, AnyObject>]()
    
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
            playersNameShuffle = shuffle(playersName)
            self.transition()
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
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject!) {
        if (segue.identifier == "GoToRandomTeamsController") {
            var randomT = segue.destinationViewController as! randomTeamsController;
            randomT.tournamentID = self.tournamentID
            randomT.playersName = self.playersNameShuffle
            randomT.teams = self.teams
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
        var textField:UITextField = cell.configurePlayer(text: "", placeholder: "Nom du joueur \(indexPath.row+1)")
        arrayTextField.append(textField)
        
        cell.selectionStyle = UITableViewCellSelectionStyle.None
        
        return cell
    }
}
