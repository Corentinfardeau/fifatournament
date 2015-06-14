//
//  allMatchController.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class AllMatchController: UIViewController, UITableViewDataSource, UITableViewDelegate  {
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        self.view.backgroundColor = backgroundColor
        var backgroundView = UIView(frame: CGRectZero)
        self.tableView.tableFooterView = backgroundView
        self.tableView.backgroundColor = UIColor.clearColor()
        self.tableView.separatorStyle = UITableViewCellSeparatorStyle.None
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        self.matchs.removeAll(keepCapacity: true)
        if let id = defaults.valueForKey("tournamentID") as? String {
            self.api.getTournament(id, completionHandler: {
                tournament, error in
                self.tournament = tournament
                self.api.getLeague(tournament["competition_id"] as! String, completionHandler: {
                    league, error in
                    
                    dispatch_async(dispatch_get_main_queue(), {
                        
                        if let firstLeg = league["firstLeg"] as? NSArray{
                            
                            for index in 0..<firstLeg.count{
                                self.matchs.append(firstLeg[index] as! Dictionary<String, AnyObject>)
                            }
                            
                        }
                        
                        if let returnLeg = league["returnLeg"] as? NSArray{
                            
                            for index in 0..<returnLeg.count{
                                self.matchs.append(returnLeg[index] as! Dictionary<String, AnyObject>)
                            }
                            
                        }
                        
                        self.tableView.reloadData()
                    })
                    
                })
            })
        }
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return matchs.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        var cell = tableView.dequeueReusableCellWithIdentifier("cell") as! MatchTableViewCell
        //println(self.matchs[indexPath.row])
        if let homeTeam: AnyObject = self.matchs[indexPath.row]["homeTeam"]{
            if let awayTeam: AnyObject = self.matchs[indexPath.row]["awayTeam"]{
                if let scoreHomeTeam: AnyObject = self.matchs[indexPath.row]["goalHomeTeam"]{
                    if let scoreAwayTeam: AnyObject = self.matchs[indexPath.row]["goalAwayTeam"]{
                        cell.configure(homeTeam: homeTeam , awayTeam: awayTeam, scoreHomeTeam: scoreHomeTeam as! Int, scoreAwayTeam: scoreAwayTeam as! Int, played: self.matchs[indexPath.row]["played"] as! Bool, live: self.matchs[indexPath.row]["live"] as! Bool)
                    }
                }
            }
        }

        cell.selectionStyle = UITableViewCellSelectionStyle.None
        
        if indexPath.row % 2 == 1 { //alternating row backgrounds
            cell.backgroundColor = backgroundColor
        } else {
            cell.backgroundColor = tableView.backgroundColor
        }
        
        return cell
    }
    
    var tournament = Dictionary<String, AnyObject>()
    let api=API()
    let defaults = NSUserDefaults.standardUserDefaults()
    var matchs = [Dictionary<String, AnyObject>]()

}