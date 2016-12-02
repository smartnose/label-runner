name := """server-lite"""

organization  := "com.github.pvoznenko"

version := "0.0.1"

scalaVersion := "2.11.6"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")

libraryDependencies ++= {
  val akkaStreamVersion = "1.0-RC4"
  val akkaVersion = "2.3.11"

  Seq(
    "com.typesafe.akka" %% "akka-actor"                           % akkaVersion,
    "com.typesafe.akka" %% "akka-stream-experimental"             % akkaStreamVersion,
    "com.typesafe.akka" %% "akka-http-experimental"               % akkaStreamVersion,
    "com.typesafe.akka" %% "akka-http-core-experimental"          % akkaStreamVersion,
    "com.typesafe.akka" %% "akka-http-testkit-experimental"       % akkaStreamVersion,
    "ch.megard"         %% "akka-http-cors"                       % "0.1.10",
    "org.scalatest"     %% "scalatest"                            % "2.2.5" % "test",
    "com.typesafe.akka" %% "akka-testkit"                         % akkaVersion % "test"
  )
}

lazy val core = RootProject(file("../../parsing"))


val main = Project(id = "server-lite", base = file(".")).dependsOn(core)

Revolver.settings


fork in run := true