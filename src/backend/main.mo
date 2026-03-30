import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import List "mo:core/List";
import Int "mo:core/Int";

actor {
  type Wish = {
    username : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module Wish {
    public func compare(w1 : Wish, w2 : Wish) : Order.Order {
      Int.compare(w1.timestamp, w2.timestamp);
    };
  };

  let wishes = List.empty<Wish>();

  public type WishInput = {
    username : Text;
    message : Text;
  };

  public type WishOutput = {
    username : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public shared ({ caller }) func submitWish(input : WishInput) : async {
    #ok;
    #error : Text;
  } {
    if (input.username.size() == 0 or input.username.size() > 40) {
      return #error("Username must be between 1 and 40 characters.");
    };
    if (input.message.size() == 0 or input.message.size() > 120) {
      return #error("Wish must be between 1 and 120 characters.");
    };

    let wish : Wish = {
      username = input.username;
      message = input.message;
      timestamp = Time.now();
    };
    wishes.add(wish);
    #ok;
  };

  public query ({ caller }) func getAllWishes() : async [WishOutput] {
    wishes.toArray().sort().map(
      func(w) {
        {
          username = w.username;
          message = w.message;
          timestamp = w.timestamp;
        };
      }
    );
  };
};
