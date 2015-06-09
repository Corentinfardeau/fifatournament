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
        println(self.playersName)
        api.getTournament(tournamentID, completionHandler: {
            result, error in
            if(error != nil){
                println(error)
            }else{
                self.tournament = result
            }
        })
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    var tournamentID:String!
    var playersName:[String]!
    var teams = [Dictionary<String, AnyObject>]()
    var tournament = Dictionary<String, AnyObject>()
    let api = API()
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return teams.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection team: Int) -> Int {
        return teams[team]["nbPlayers"] as! Int
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! LabelTableViewCell
        cell.configure(text: "\(playersName[indexPath.section+indexPath.row])")
        return cell
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection team: Int) -> String? {
        return teams[team]["teamName"] as? String
    }
    
    func tableView(tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        let header: UITableViewHeaderFooterView = view as! UITableViewHeaderFooterView
        header.contentView.backgroundColor = UIColor.whiteColor()
        header.textLabel.textColor = UIColor.lightGrayColor()
        header.textLabel.font = UIFont(name: "SourceSansPro-Regular", size: 15)
        header.textLabel.textAlignment = NSTextAlignment.Center
    }
}
