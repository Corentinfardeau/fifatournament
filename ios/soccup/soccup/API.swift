//
//  API.swift
//  soccup
//
//  Created by Corentin FARDEAU on 31/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import Alamofire

class API {
    
    private let apiURL:String!
    private var params:Dictionary<String, AnyObject>!
    private var section:String!
    
    init(){
        self.apiURL = "http://localhost:8080/api/"
    }
    
    
    /*
    
    TOURNAMENT
    
    */
    
    //Create a tournament
    func createTournament(type: String, publicBool: Bool, random : Bool, nbPlayers: Int, nbPlayersByTeam : Int, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()){
        
        self.params = ["type": type, "public" : publicBool, "random" : random, "nbPlayers" : nbPlayers, "nbPlayersByTeam" : nbPlayersByTeam]
        self.section = "tournament/create"
        makePOSTCallObject(section, params: params, completionHandler: completionHandler)
        
    }
    
    //Get a tournament
    func getTournament(id:String, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()){
        self.section = "tournament/"+id
        makeGETCallObject(section, completionHandler: completionHandler)
    }
    
    /*
    
    TEAM
    
    */
    
    //Create teams
    func createTeams(id:String, nbPlayers:Int, completionHandler: (responseObject:NSArray, error: NSError?) -> ()){
        
        self.params = ["nbPlayers" : nbPlayers]
        self.section = "team/create/"+id
        makePOSTCallArray(section, params: params, completionHandler: completionHandler)
        
    }
    
    //Create players
    func createPlayers(id:String, players:NSArray, completionHandler: (responseObject:NSArray, error: NSError?) -> ()){
        
        self.params = ["players" : players]
        self.section = "player/create/"+id
        makePOSTCallArray(section, params: params, completionHandler: completionHandler)
        
    }
    
    //Get players
    func getTeam(id:String, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()){
        self.section = "team/"+id
        makeGETCallObject(section, completionHandler: completionHandler)
    }
    
    //Create league
    func createLeague(id:String, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()){

        self.section = "league/create/"+id
        makePOSTCallObject(section, params: params, completionHandler:completionHandler)
    }
    
    //Create matchs
    func createMatchs(id:String, teams:Array<AnyObject>, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()){
        
        self.params = ["teams" : teams]
        self.section = "matchs/create/"+id
        makePOSTCallObject(section, params: params, completionHandler:completionHandler)
    }
    
    //Get match
    func getMatch(id:String, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()){
        self.section = "match/"+id
        makeGETCallObject(section, completionHandler: completionHandler)
    }
    
    //Update match
    func updateMatch(id:String, params:Dictionary<String, AnyObject>, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()){
        self.params = params
        self.section = "match/update/"+id
        makePOSTCallObject(section, params: params, completionHandler: completionHandler)
    }
    
    //Update team
    func updateTeam(id:String, params:Dictionary<String, AnyObject>, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()){
        self.params = params
        self.section = "team/update/"+id
        makePOSTCallObject(section, params: params, completionHandler: completionHandler)
    }
    
    // HELPERS to make request
    
    // Make POST request -> Return Dictionnary
    func makePOSTCallObject(section: String, params:Dictionary<String, AnyObject>, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()) {
        
        Alamofire.request(.POST, self.apiURL+section, parameters: params, encoding: .JSON)
            .responseJSON { request, response, responseObject, error in
                completionHandler(responseObject: responseObject as! Dictionary, error: error)
        }
    }
    
    // Make GET request -> Return Dictionnary
    func makeGETCallObject(section: String, completionHandler: (responseObject:Dictionary<String, AnyObject>, error: NSError?) -> ()) {
        
        Alamofire.request(.GET, self.apiURL+section)
            .responseJSON { request, response, responseObject, error in
                completionHandler(responseObject: responseObject as! Dictionary, error: error)
        }
    }
    
    // Make POST request -> Return Array
    func makePOSTCallArray(section: String, params:Dictionary<String, AnyObject>, completionHandler: (responseObject:NSArray, error: NSError?) -> ()) {
        
        Alamofire.request(.POST, self.apiURL+section, parameters: params)
            .responseJSON { request, response, responseObject, error in
                completionHandler(responseObject: responseObject as! NSArray, error: error)
        }
    }
    
    // Make GET request -> Return Array
    func makeGETCallArray(section: String, completionHandler: (responseObject:NSArray, error: NSError?) -> ()) {
        
        Alamofire.request(.GET, self.apiURL+section)
            .responseJSON { request, response, responseObject, error in
                completionHandler(responseObject: responseObject as! NSArray, error: error)
        }
    }
}