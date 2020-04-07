>\>test  

*test-start needs title to indecate a any reaction of the program*
>*not sure how this hash got in there, but it doesn't seem to interfere much*
>#### Simple object commands (bricks): Error (test 7)
>
>- Expected (A): The kitchen  
>- ...Found (A): #The kitchen  
>
>#### Simple object commands (bricks): Error (test 10)
>
>- Expected (A): The kitchen  
>- ...Found (A): #The kitchen  
>
>#### Simple object commands (bricks): Error (test 13)
>
>- Expected (A): The kitchen  
>- ...Found (A): #The kitchen  
>
>#### Simple object commands (bricks): Error (test 15)
>
>- Expected (A): The kitchen  
>- ...Found (A): #The kitchen  
>
>#### Simple object commands (bricks): Error (test 16)
>
>- Expected (A): The lounge  
>- ...Found (A): #The lounge  
>
>#### Wear/remove: Error (test 1)
>
>- Expected (A): The bedroom  
>- ...Found (A): #The bedroom  
>
>#### Wear/remove: Error (test 19)
>
>- Expected (A): The lounge  
>- ...Found (A): #The lounge  
>
>#### say: Error (test 2)
>
>- Expected (A): The dining room  
>- ...Found (A): #The dining room  
>
>#### NPC commands 1: Error (test 9)
>
>- Expected (A): The dining room  
>- ...Found (A): #The dining room  
>
>#### NPC commands 1: Error (test 14)
>
>- Expected (A): The lounge  
>- ...Found (A): #The lounge  
>
>#### NPC commands (go): Error (test 6)
>
>- Expected (A): The kitchen  
>- ...Found (A): #The kitchen  
>
>#### The charger: Error (test 2)
>
>- Expected (A): The garage  
>- ...Found (A): #The garage  
>
>#### Path finding: Error (test 7)
>
>- Expected (A): The kitchen  
>- ...Found (A): #The kitchen  
>
>#### Path finding: Error (test 8)
>
>- Expected (A): The lounge  
>- ...Found (A): #The lounge  
>
>#### Path finding: Error (test 9)
>
>- Expected (A): The conservatory  
>- ...Found (A): #The conservatory  
>
>#### Path finding: Error (test 10)
>
>- Expected (A): The garden  
>- ...Found (A): #The garden  
>
>#### Agendas: Error (test 8)
>
>- Expected (A): The conservatory  
>- ...Found (A): #The conservatory  
>
>#### Agendas: Error (test 11)
>
>- Expected (A): The lounge  
>- ...Found (A): #The lounge  
>
>#### Agendas: Error (test 12)
>
>- Expected (A): The dining room  
>- ...Found (A): #The dining room  
>
>#### Transit: Error (test 1)
>
>- Expected (A): The lift  
>- ...Found (A): #The lift  
>
>#### Transit: Error (test 4)
>
>- Expected (A): The bedroom  
>- ...Found (A): #The bedroom  
>
>#### Transit: Error (test 5)
>
>- Expected (A): The lift  
>- ...Found (A): #The lift  
>
>#### Transit: Error (test 9)
>
>- Expected (A): The dining room  
>- ...Found (A): #The dining room  
>
>#### Transit: Error (test 10)
>
>- Expected (A): The lift  
>- ...Found (A): #The lift  
>- Expected (A): The dining room  
>- ...Found (A): #The dining room  
>
>#### Push: Error (test 1)
>
>- Expected (A): The lounge  
>- ...Found (A): #The lounge  
>
>#### Push: Error (test 2)
>
>- Expected (A): The conservatory  
>- ...Found (A): #The conservatory  
>
>#### ensemble: Error (test 1)
>
>- Expected (A): The wardrobe  
>- ...Found (A): #The wardrobe  
>
>#### ensemble: Error (test 3)
>
>- Expected (A): The wardrobe  
>- ...Found (A): #The wardrobe  
>
>#### pre-shop: Error (test 1)
>
>- Expected (A): The bedroom  
>- ...Found (A): #The bedroom  
>
>#### pre-shop: Error (test 2)
>
>- Expected (A): The lounge  
>- ...Found (A): #The lounge  
>
>#### pre-shop: Error (test 3)
>
>- Expected (A): The conservatory  
>- ...Found (A): #The conservatory  
>
>#### pre-shop: Error (test 4)
>
>- Expected (A): The garden  
>- ...Found (A): #The garden  
>
>#### pre-shop: Error (test 5)
>
>- Expected (A): The shop  
>- ...Found (A): #The shop  
>
#### shop - buy: Error (test 5)

- Expected: false  
- ...Found: true  

> *tests depend on success of previous test in chain either abort chain or adjust evaluation*
>#### shop - buy: Error (test 6)
>
>- Expected: false  
>- ...Found: true  
>- Error when testing menu (possibly due to disambiguation?),  
>- test.menuResponseNumber = undefined  
>
>#### shop - buy: Error (test 7)
>
>- Expected (A): You buy the carrot for $0,02.  
>- ...Found (A): undefined  
>
>#### shop - buy: Error (test 8)
>
>- Expected: 16  
>- ...Found: 18  
>
>#### shop - buy: Error (test 11)
>
>- Expected: 1  
>- ...Found: 3  
>- Error when testing menu (possibly due to disambiguation?),  
>- test.menuResponseNumber = undefined  
>
>#### shop - buy: Error (test 15)
>
>- Expected (A): You can't afford the carrot (need $0,02).  
>- ...Found (A): undefined  
>
>#### shop - buy: Error (test 16)
>
>- Expected: 1  
>- ...Found: 3  
>
>#### shop - sell: Error (test 1)
>
>- Expected (A): You can't sell the carrot here.  
>- ...Found (A): You don't have it.  
>
>#### shop - sell: Error (test 2)
>
>- Expected: 1  
>- ...Found: 3  
>
>#### shop - sell: Error (test 4)
>
>- Expected: 9  
>- ...Found: 11  
>
#### shop - sell: Error (test 5)

- Expected (A): You don't have it.  
- ...Found (A): You can't see anything you might call   'trophy' >here.  

#### shop - sell: Error (test 6)

- Expected: 9  
- ...Found: 11

> *result needs title*
>
>- Number of tests: 416  
>- Number of fails: 45  
>- Elapsed time: 979 ms (2.4 ms/test)
>
