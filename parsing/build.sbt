
organization := "smartnose@gmail.com"

name := "parsing"

version := "0.1.0-SNAPSHOT"

scalaVersion := "2.11.8"

libraryDependencies ++= Seq(
    "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4",
    "org.scalactic" %% "scalactic" % "3.0.0",
    "org.scalatest" %% "scalatest" % "3.0.0" % "test"
  )
