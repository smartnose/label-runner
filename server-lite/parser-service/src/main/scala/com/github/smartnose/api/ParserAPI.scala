package com.github.smartnose.api

import akka.http.scaladsl.server.Directives._
import ch.megard.akka.http.cors.CorsDirectives._
import com.github.smartnose.marshallers.SprayJsonSupport._
import wws.labeling.engine.Engine

trait ParserAPI extends {
  val parserRoutes = cors() {
    (path("parse") & get) {
      parameters('query) { (query) => {
        complete(Engine.createClientJson(query))
        }
      }
    }
  }
}
