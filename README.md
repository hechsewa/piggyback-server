# piggyback-server
A project for design patterns classes implementing a simple piggyback server using NodeJS and AngularJS.
## Linki do diagramów

* PU/class/sequence:
https://drive.google.com/file/d/17NsQQ1RONKSsNVQDVN8mzHA01HI8PY81/view?usp=sharing

## Metoda piggyback
Metoda piggyback jest jedną z metod wykorzystujących 'Reverse AJAX'. Zalicza się do nich m.in. metody 'Comet', 'Polling', 'Long Polling'. Polega na odsyłaniu przez serwer odpowiedzi na zapytanie klienta wraz z dodatkowymi informacjami/eventami pojawiającymi się pomiędzy kolejnymi zapytaniami. Działanie metody piggyback na diagramie:

![alt text](https://raw.githubusercontent.com/hechsewa/piggyback-server/master/docs/imgs/piggyback-diagram.gif)


Zalety metody piggyback:
+ pozwala na usunięcie zbędnych zapytań klienckich (takich, które nie wymagają zwracania żadnych danych)

Wady metody piggyback:
- może upłynąć dużo czasu zanim pewna zmiana na serwerze będzie widoczna dla klientów, np. klient czyta blog, więc przez dłuższy okres czasu nie wysyła żadnych żądań, więc serwer nie może odesłać mu nowych informacji
