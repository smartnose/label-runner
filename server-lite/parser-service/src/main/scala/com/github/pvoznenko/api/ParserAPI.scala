package com.github.pvoznenko.api

import akka.http.scaladsl.server.Directives._

trait ParserAPI extends {
  val parserRoutes =
    (path("parse") & get) {
        parameters('utterance) { (utterance) => {
          complete(utterance)
        }
      }
    }
}
